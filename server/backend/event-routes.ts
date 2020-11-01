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
  name? : eventName;
  browser? : browser
}

router.get('/all', (req: Request, res: Response) => {
  const data = db.get('events').value()
  res.json(data);
});

router.get('/all-filtered', (req: Request, res: Response) => {
  const filter : Filter = req.query;
  const f: f = {name: filter.type, browser: filter.browser};
  if (!f.name) delete f.name;
  if (!f.browser) delete f.browser;

  let data = db.get('events').filter(f).value();

  if (filter.search !== "") {
    const reg: RegExp = new RegExp(filter.search, "i");
    data = data.filter((event: Event) => {
      return reg.test(JSON.stringify(event));
    });
  }

  if (filter.sorting) {
    data.sort((e1: Event, e2: Event) =>
      filter.sorting[0] === "+" ? e1.date - e2.date : e2.date - e1.date
    )};
    const more = data.length >= filter.offset;

  res.send({ events: data.slice(0, filter.offset), more 
  });
});


router.get('/by-days/:offset', (req: Request, res: Response) => {
  res.send('/by-days/:offset')
});

router.get('/by-hours/:offset', (req: Request, res: Response) => {
  res.send('/by-hours/:offset')
});

router.get('/today', (req: Request, res: Response) => {
  res.send('/today')
});

router.get('/week', (req: Request, res: Response) => {
  res.send('/week')
});

router.get('/retention', (req: Request, res: Response) => {
  const {dayZero} = req.query
  res.send('/retention')
});

router.get('/:eventId',(req : Request, res : Response) => {
  res.send('/:eventId')
});

router.post('/', (req: Request, res: Response) => {
  res.send('/')
});

router.get('/chart/os/:time',(req: Request, res: Response) => {
  res.send('/chart/os/:time')
})

  
router.get('/chart/pageview/:time',(req: Request, res: Response) => {
  res.send('/chart/pageview/:time')
})

router.get('/chart/timeonurl/:time',(req: Request, res: Response) => {
  res.send('/chart/timeonurl/:time')
})

router.get('/chart/geolocation/:time',(req: Request, res: Response) => {
  res.send('/chart/geolocation/:time')
})


export default router;
