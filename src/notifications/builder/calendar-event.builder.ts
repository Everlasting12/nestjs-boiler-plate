import ical, { ICalCalendarMethod, ICalEventData } from 'ical-generator';

type Organiser = {
  name?: string;
  email: string;
};

export type Attendee = {
  name: string;
  email: string;
  status: string;
  rsvp: boolean; // Set rsvp to true to request RSVP
  partstat: string; // Set partstat to PENDING for RSVP
  role: string; // Set role to REQ-PARTICIPANT for RSVP
};

type Answer = {
  answer: string;
  value: string;
};

export type Question = {
  question: string;
  answers: Answer[];
};
type Event = {
  start: Date;
  end: Date;
  summary: string;
  timezone: string;
  method: string;
  url?: string;
  allDay: boolean;
  description?: string;
  location?: string;
  organiser: Organiser;
  attendees: Attendee[];
  questions?: Question[];
};

export class CalenderEventBuilder {
  private event: Event = {} as Event;
  constructor(
    startDate: Date,
    endDate: Date,
    summary: string,
    allDay: boolean = false,
  ) {
    this.event.start =
      typeof startDate === 'string' ? new Date(startDate) : startDate;
    this.event.end = typeof endDate === 'string' ? new Date(endDate) : endDate;
    this.event.summary = summary;
    this.event.method = 'REQUEST';
    this.event.allDay = allDay;
    this.event.organiser = {} as Organiser;
    this.event.attendees = [];
    this.event.questions = [];
    this.event.timezone = 'Asia/Kolkata';
  }

  setStart(date: Date) {
    this.event.start = date;
    return this;
  }

  setEnd(date: Date) {
    this.event.end = date;
    return this;
  }

  setSummary(summary: string) {
    this.event.summary = summary;
    return this;
  }

  setMethod(method: string) {
    this.event.method = method;
    return this;
  }

  setDescription(description: string) {
    this.event.description = description;
    return this;
  }

  setLocation(location: string) {
    this.event.location = location;
    return this;
  }
  setUrl(url: string) {
    this.event.url = url;
    return this;
  }

  setOrganizer(organiser: Organiser) {
    if (organiser?.name) this.event.organiser.name = organiser.name;
    this.event.organiser.email = organiser.email;
    return this;
  }

  addAttendee(
    name: string,
    email: string,
    status: string = 'NEEDS-ACTION',
    rsvp: boolean = true,
    partstat: string = 'PENDING',
    role: string = 'REQ-PARTICIPANT',
  ) {
    this.event.attendees.push({ name, email, status, rsvp, partstat, role });
    return this;
  }

  addQuestion(question: string, answers: Answer[]) {
    this.event.questions.push({ question, answers });
    return this;
  }

  build() {
    const cal = ical();
    // cal.createEvent
    cal.createEvent(this.event as ICalEventData);
    cal.method(ICalCalendarMethod.REQUEST);
    return cal;
  }
}
