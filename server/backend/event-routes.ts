///<reference path="types.ts" />

import express from "express";
import { Request, Response } from "express";

// some useful database functions in here:
import db, {
} from "./database";
import { browser, Event, eventName, weeklyRetentionObject } from "../../client/src/models/event";
import { ensureAuthenticated, validateMiddleware } from "./helpers";

import {
  shortIdValidation,
  searchValidation,
  userFieldsValidator,
  isUserValidator,
} from "./validators";
import { filter } from "bluebird";
import { result } from "lodash";
const router = express.Router();

// Routes
type sort = '+date' | '-date';

interface Filter {
  sorting: string;
  type: eventName;
  browser: browser;
  search: string;
  offset: number;
}
interface f {
  name?: eventName;
  browser?: browser
}

const getStartOfDay = (date: Date): Date => {
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  return new Date(`${year}/${month}/${day}`)
}

const getCurrentDayTimeWithOffset = (offset: number) => {
  return getStartOfDay(new Date()).getTime() - (24 * 60 * 60 * 1000) * offset
}

router.get('/all', (req: Request, res: Response) => {
  const data = db.get('events').value()
  res.json(data);
});

router.get('/all-filtered', (req: Request, res: Response) => {
  const filter: Filter = req.query;
  const f: f = { name: filter.type, browser: filter.browser };
  if (!f.name) delete f.name;
  if (!f.browser) delete f.browser;

  let data: any[] = db.get('events').filter(f).value();

  if (filter.search !== "") {
    const reg: RegExp = new RegExp(filter.search, "i");
    data = data.filter((event: Event) => {
      return Object.values(event).some(value => {
        return reg.test(value.toString());
      })
    });
  }

  if (filter.sorting) {
    data.sort((e1: Event, e2: Event) =>
      filter.sorting[0] === "+" ? e1.date - e2.date : e2.date - e1.date
    )
  };
  const more = data.length >= filter.offset;

  res.send({
    events: data.slice(0, filter.offset), more
  });
});

router.get('/by-days/:offset', (req: Request, res: Response) => {
  let data: any[] = db.get('events').value();
  let dayTime = 24 * 60 * 60 * 1000;
  let endDate = getStartOfDay(new Date()).getTime() + dayTime - 1 - parseInt(req.params.offset) * dayTime;
  data = data.filter(event => {
    if (endDate > event.date && endDate - 7 * dayTime < event.date) {
      return true
    } else {
      return false
    }
  })
  let days: Array<number> = [0, 0, 0, 0, 0, 0, 0];
  data.forEach(event => {
    let temp = endDate - event.date;
    days[Math.floor(temp / dayTime)]++;
  })
  const results: any[] = [];
  days.forEach((countByDay, index) => {
    let year = new Date(endDate - dayTime * index).getUTCFullYear();
    let month = new Date(endDate - dayTime * index).getUTCMonth();
    let day = new Date(endDate - dayTime * index).getUTCDate();
    results.unshift({
      date: `${year}/${month}/${day}`,
      count: countByDay
    })
  })
  res.send(results)
});

router.get('/by-hours/:offset', (req: Request, res: Response) => {
  let dayTime = 24 * 60 * 60 * 1000;
  const offset = parseInt(req.params.offset);
  let data = db
    .get('events')
    .filter((event: Event) => {
      return (getCurrentDayTimeWithOffset(offset) < event.date &&
        event.date < getCurrentDayTimeWithOffset(offset) + dayTime)
    })
    .value();

  let hoursCount: Array<number> = Array(24).fill(0)
  data.forEach(event => {
    hoursCount[Math.floor((((event.date - getCurrentDayTimeWithOffset(offset)) / 1000) / 60) / 60)]++;
  })
  const results: any[] = [];
  hoursCount.forEach((hour, index) => {
    results.push({
      hour: `${index / 10 > 1 ? `${index}` : `0${index}`}:00`,
      count: hour
    })
  })
  res.json(results)
});

router.get('/today', (req: Request, res: Response) => {
  res.send('/today')
});

router.get('/week', (req: Request, res: Response) => {
  res.send('/week')
});

router.get('/retention', (req: Request, res: Response) => {
  const { dayZero } = req.query
  res.send('/retention')
});

router.get('/:eventId', (req: Request, res: Response) => {
  res.send('/:eventId')
});

router.post('/', (req: Request, res: Response) => {
  const event: Event = req.body;
  db.get('events').push(event).write();
  res.send("added");
});

router.get('/chart/os/:time', (req: Request, res: Response) => {
  res.send('/chart/os/:time')
})


router.get('/chart/pageview/:time', (req: Request, res: Response) => {
  res.send('/chart/pageview/:time')
})

router.get('/chart/timeonurl/:time', (req: Request, res: Response) => {
  res.send('/chart/timeonurl/:time')
})

router.get('/chart/geolocation/:time', (req: Request, res: Response) => {
  res.send('/chart/geolocation/:time')
})


export default router;
