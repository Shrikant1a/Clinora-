# Clinora - n8n Workflow Documentation

## Overview
This production-grade n8n workflow implements the end-to-end appointment automation pipeline for **Clinora**:
`WhatsApp -> n8n -> OpenAI GPT -> Google Calendar -> Google Sheets`

It features 18 interconnected nodes implementing:
1. Webhook authentication & message reception.
2. State management in Google Sheets (`Conversations` tab).
3. OpenAI GPT AI Agent with Hindi/English/Hinglish extraction and strict emergency detection.
4. Real-time Google Calendar availability queries.
5. Slot calculation code node.
6. Double-booking & race condition prevention (checking availability twice: once before proposing, and again immediately prior to booking).
7. Google Calendar event creation.
8. Google Sheets `Appointments_Register` appending.
9. WhatsApp confirmation message dispatch.
10. Automated 1-hour prior WhatsApp reminder cron (runs every 5 minutes).
11. 9:00 PM IST Daily Report summary email generator and Gmail dispatcher.
12. Error trigger & failure notification pipeline.

---

## Node-by-Node Directory

| Node # | Node Name | Type | Description |
|---|---|---|---|
| 1 | WhatsApp Webhook Trigger | `n8n-nodes-base.webhook` | Receives incoming messages from Meta WhatsApp Cloud API |
| 2 | Google Sheets: Get Conversation State | `n8n-nodes-base.googleSheets` | Looks up phone number in `Conversations` sheet |
| 3 | OpenAI AI Agent | `n8n-nodes-base.openAi` | Extracts Name, Problem, Preferred Date in structured JSON |
| 4 | Switch Intent Router | `n8n-nodes-base.switch` | Routes by intent (`book`, `choose_slot`, `cancel`, `escalate`) |
| 5 | Google Calendar: Fetch Doctor Events | `n8n-nodes-base.googleCalendar` | Retrieves existing appointments for doctor |
| 6 | Code: Compute Free Slots | `n8n-nodes-base.code` | Calculates free 30-min slots during working hours |
| 7 | WhatsApp: Send Free Slots Message | `n8n-nodes-base.httpRequest` | Delivers available slot choices to patient on WhatsApp |
| 8 | Google Calendar: Re-check Slot Clash | `n8n-nodes-base.googleCalendar` | Race-condition check right before booking |
| 9 | IF Slot is Truly Free | `n8n-nodes-base.if` | Verifies zero overlapping events |
| 10 | Google Calendar: Create Event | `n8n-nodes-base.googleCalendar` | Creates calendar entry with patient name & phone |
| 11 | Google Sheets: Append Row (Register) | `n8n-nodes-base.googleSheets` | Logs appointment in `Appointments_Register` |
| 12 | WhatsApp: Send Confirmation | `n8n-nodes-base.httpRequest` | Sends final confirmation with address and details |
| 13 | Schedule Trigger (5 Min Reminders) | `n8n-nodes-base.scheduleTrigger` | Checks every 5 mins for appointments in 60 minutes |
| 14 | WhatsApp: Send 1-Hour Reminder Template | `n8n-nodes-base.httpRequest` | Sends approved Meta utility template |
| 15 | Schedule Trigger (21:00 IST Report) | `n8n-nodes-base.scheduleTrigger` | Cron: `0 21 * * *` (Asia/Kolkata) |
| 16 | Google Sheets: Read Today Rows | `n8n-nodes-base.googleSheets` | Aggregates daily booked, cancelled, upcoming stats |
| 17 | Gmail: Send 9:00 PM Daily Report Email | `n8n-nodes-base.gmail` | Sends branded HTML summary to clinic owner |
| 18 | Error Trigger & Alert Notification | `n8n-nodes-base.errorTrigger` | Alerts sysadmin/Slack on node failures |

---

## Required Credentials in n8n

1. **Meta WhatsApp Cloud API**:
   - `WHATSAPP_PHONE_NUMBER_ID`
   - `WHATSAPP_API_TOKEN` (System user permanent token with `whatsapp_business_messaging` scope)
2. **OpenAI API Key**:
   - OpenAI Credential name: `openai-clinic-cred`
3. **Google Service Account or OAuth2**:
   - `google-sheets-clinic-cred`: Google Sheets OAuth2 / Service Account with drive & sheets scopes.
   - `google-calendar-clinic-cred`: Google Calendar OAuth2 with calendar events scope.
   - `gmail-clinic-cred`: Gmail OAuth2 for sending 9 PM reports.

---

## Environment Variables Mapping

```env
GOOGLE_SHEETS_SPREADSHEET_ID=1A2B3C4D5E6F_YOUR_SHEET_ID
DOCTOR_CALENDAR_ID=dr.mehta.clinic@gmail.com
WHATSAPP_PHONE_NUMBER_ID=109823487192837
REPORT_RECIPIENT_EMAIL=doctor@mehtaclinic.com
```

---

## Example Inbound WhatsApp Payload

```json
{
  "object": "whatsapp_business_account",
  "entry": [
    {
      "id": "109823487192837",
      "changes": [
        {
          "value": {
            "messaging_product": "whatsapp",
            "metadata": {
              "display_phone_number": "+919820012345",
              "phone_number_id": "109823487192837"
            },
            "contacts": [{ "profile": { "name": "Rahul Verma" }, "wa_id": "919820111223" }],
            "messages": [
              {
                "from": "919820111223",
                "id": "wamid.HBgMOTE5ODIwMTExMjIzFQIAEhgg...",
                "timestamp": "1732300000",
                "text": { "body": "Hi, doctor ki appointment chahiye" },
                "type": "text"
              }
            ]
          },
          "field": "messages"
        }
      ]
    }
  ]
}
```

---

## How to Import into n8n

1. Open your n8n instance (e.g. `https://n8n.yourclinic.com` or `http://localhost:5678`).
2. Click **Workflows** -> **Import from File...**
3. Select `n8n/clinic-automation-workflow.json`.
4. Connect your credentials for OpenAI, Google Calendar, Google Sheets, and Gmail.
5. Set the active toggle to **ON**.
