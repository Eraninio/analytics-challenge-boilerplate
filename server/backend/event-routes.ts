///<reference path="types.ts" />

import express from "express";
import { Request, Response } from "express";
import { getPaginatedItems } from "../../client/src/utils/transactionUtils";



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
import { database } from "faker";
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

const getEndOfDay = (date: Date): Date => {
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  const startTime = new Date(`${year}/${month}/${day}`).getTime();
  const endTime = startTime + 24 * 60 * 60 * 1000 - 1;
  return new Date(endTime);
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
  const dayZero = parseInt(req.query.dayZero)
  let signUpData = db.get('events').filter({ name: 'signup' }).orderBy('date').value();
  let dayTime = 24 * 60 * 60 * 1000;
  const newUsersPerWeek: any[] = [];
  let startDay = getStartOfDay(new Date(dayZero)).getTime();
  while (startDay < new Date().getTime()) {
    let count = 0;
    let signedUpUsers: string[] = []
    signUpData.forEach(event => {
      if (startDay < event.date && event.date < startDay + 7 * dayTime) {
        signedUpUsers.push(event.distinct_user_id);
        count++;
      }
    })
    newUsersPerWeek.push({ signedUpUsers, count });
    startDay += dayTime * 7
  }


  let loginData = db.get('events').filter({ name: 'login' }).orderBy('date').value();
  const weeklyRetentionArray: weeklyRetentionObject[] = [];
  startDay = getStartOfDay(new Date(dayZero)).getTime();
  for (let i = 0; i < newUsersPerWeek.length; i++) {
    startDay += dayTime * 7 * (i);
    const registrationWeek = i + 1;
    const start = new Date(startDay).toDateString();
    const end = new Date(startDay + dayTime * 7).toDateString();
    const newUsers = newUsersPerWeek[i].count;
    startDay += dayTime * 7;
    let users = newUsersPerWeek[i].signedUpUsers.slice();
    let weeklyRetention = [100];
    while (startDay <= new Date().getTime()) {
      let count = 0;
      loginData.forEach(event => {
        if (startDay < event.date && event.date < startDay + 7 * dayTime) {
          const index = users.findIndex((id: string) => id === event.distinct_user_id);
          if (index != -1) {
            count++;
            users.splice(index, 1);
          }
        }
      })
      weeklyRetention.push(Math.round((count / newUsersPerWeek[i].count) * 100))
      startDay += dayTime * 7;
      users = newUsersPerWeek[i].signedUpUsers.slice();
    }
    const weeklyRetentionObject: weeklyRetentionObject = {
      registrationWeek,
      newUsers,
      weeklyRetention,
      start,
      end

    }
    weeklyRetentionArray.push(weeklyRetentionObject);
    startDay = getStartOfDay(new Date(dayZero)).getTime();
  }

  res.send(weeklyRetentionArray)
});

router.get('/filtered', (req: Request, res: Response) => {
  const filter: Filter = req.query;
  const f: f = { name: filter.type, browser: filter.browser };

  if (!f.name) delete f.name;
  if (!f.browser) delete f.browser;

  let data = db.get('events').filter(f).value();

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
    );
  }
  const { totalPages, data: paginatedItems } = getPaginatedItems(
    req.query.page,
    req.query.limit,
    data
  );

  res.status(200);
  res.json({
    pageData: {
      page: res.locals.paginate.page,
      limit: res.locals.paginate.limit,
      hasNextPages: res.locals.paginate.hasNextPages(totalPages),
      totalPages,
    },
    results: paginatedItems,
  });
}
);

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

