/**
 * Google Sheets Adapter
 * Writes confirmed appointments to Appointments_Register tab
 * and reads Daily_Report_Log.
 */

export interface SheetRowAppointment {
  appointmentId: string;
  createdAt: string;
  patientName: string;
  phone: string;
  problem: string;
  doctor: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  calendarEventId: string;
  reminderSent: string;
  source: string;
}

export interface ISheetsAdapter {
  isMock(): boolean;
  appendAppointment(spreadsheetId: string, row: SheetRowAppointment): Promise<boolean>;
  updateStatus(spreadsheetId: string, appointmentId: string, status: string): Promise<boolean>;
}

export class MockSheetsAdapter implements ISheetsAdapter {
  isMock(): boolean {
    return true;
  }

  async appendAppointment(spreadsheetId: string, row: SheetRowAppointment): Promise<boolean> {
    // Mock write logged to console in dev mode
    console.log(`[Google Sheets Mock] Appended row to ${spreadsheetId}:`, row);
    return true;
  }

  async updateStatus(spreadsheetId: string, appointmentId: string, status: string): Promise<boolean> {
    console.log(`[Google Sheets Mock] Updated appointment ${appointmentId} to status: ${status}`);
    return true;
  }
}

export class GoogleSheetsAdapter implements ISheetsAdapter {
  isMock(): boolean {
    return false;
  }

  async appendAppointment(spreadsheetId: string, row: SheetRowAppointment): Promise<boolean> {
    // TODO: Google Sheets API v4 append
    // const auth = new google.auth.JWT(...);
    // const sheets = google.sheets({ version: 'v4', auth });
    // await sheets.spreadsheets.values.append({ ... });
    return true;
  }

  async updateStatus(spreadsheetId: string, appointmentId: string, status: string): Promise<boolean> {
    // TODO: Google Sheets API v4 update
    return true;
  }
}

export function getSheetsAdapter(): ISheetsAdapter {
  if (process.env.GOOGLE_CLIENT_EMAIL && process.env.GOOGLE_SHEETS_SPREADSHEET_ID) {
    return new GoogleSheetsAdapter();
  }
  return new MockSheetsAdapter();
}
