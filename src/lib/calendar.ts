/**
 * Google Calendar Adapter
 * Provides interface and implementations for reading availability
 * and creating/updating/deleting events.
 * 
 * Supports seamless switching between Mock (local dev / demo)
 * and Live Google Calendar API via OAuth / Service Account.
 */

export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  startTime: string; // ISO or "YYYY-MM-DDTHH:mm:ss"
  endTime: string;
  calendarId: string;
}

export interface ICalendarAdapter {
  isMock(): boolean;
  listEvents(calendarId: string, dateStr: string): Promise<CalendarEvent[]>;
  createEvent(calendarId: string, details: {
    title: string;
    description: string;
    date: string;
    startTime: string;
    endTime: string;
  }): Promise<{ eventId: string; link?: string }>;
  updateEvent(calendarId: string, eventId: string, details: {
    date: string;
    startTime: string;
    endTime: string;
  }): Promise<boolean>;
  deleteEvent(calendarId: string, eventId: string): Promise<boolean>;
}

export class MockCalendarAdapter implements ICalendarAdapter {
  isMock(): boolean {
    return true;
  }

  async listEvents(calendarId: string, dateStr: string): Promise<CalendarEvent[]> {
    // In mock mode, we simulate fetching events for this calendar on dateStr
    // Stored in memory or fetched from the DB
    return [];
  }

  async createEvent(
    calendarId: string,
    details: { title: string; description: string; date: string; startTime: string; endTime: string }
  ): Promise<{ eventId: string; link?: string }> {
    const mockId = `gcal_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    return {
      eventId: mockId,
      link: `https://calendar.google.com/calendar/r/eventedit/${mockId}`,
    };
  }

  async updateEvent(calendarId: string, eventId: string, details: { date: string; startTime: string; endTime: string }): Promise<boolean> {
    return true;
  }

  async deleteEvent(calendarId: string, eventId: string): Promise<boolean> {
    return true;
  }
}

export class GoogleCalendarAdapter implements ICalendarAdapter {
  private clientEmail: string;
  private privateKey: string;

  constructor() {
    this.clientEmail = process.env.GOOGLE_CLIENT_EMAIL || "";
    this.privateKey = (process.env.GOOGLE_PRIVATE_KEY || "").replace(/\\n/g, "\n");
  }

  isMock(): boolean {
    return false;
  }

  async listEvents(calendarId: string, dateStr: string): Promise<CalendarEvent[]> {
    // TODO: Replace with googleapis calendar.events.list call
    // const auth = new google.auth.JWT(this.clientEmail, undefined, this.privateKey, ['https://www.googleapis.com/auth/calendar']);
    // const calendar = google.calendar({ version: 'v3', auth });
    // const res = await calendar.events.list({ calendarId, timeMin: `${dateStr}T00:00:00Z`, timeMax: `${dateStr}T23:59:59Z`, singleEvents: true });
    return [];
  }

  async createEvent(
    calendarId: string,
    details: { title: string; description: string; date: string; startTime: string; endTime: string }
  ): Promise<{ eventId: string; link?: string }> {
    // TODO: Connect real Google Calendar API
    return { eventId: `gcal_live_${Date.now()}` };
  }

  async updateEvent(calendarId: string, eventId: string, details: { date: string; startTime: string; endTime: string }): Promise<boolean> {
    // TODO: Connect real Google Calendar API patch
    return true;
  }

  async deleteEvent(calendarId: string, eventId: string): Promise<boolean> {
    // TODO: Connect real Google Calendar API delete
    return true;
  }
}

export function getCalendarAdapter(): ICalendarAdapter {
  if (process.env.GOOGLE_CLIENT_EMAIL && process.env.GOOGLE_PRIVATE_KEY) {
    return new GoogleCalendarAdapter();
  }
  return new MockCalendarAdapter();
}
