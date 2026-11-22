import { PrismaClient } from "@prisma/client";
import { format, subDays, addDays } from "date-fns";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // Clean existing data
  await prisma.dailyReportLog.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.doctor.deleteMany();
  await prisma.clinic.deleteMany();
  await prisma.lead.deleteMany();

  // 1. Create Primary Clinic
  const mehtaClinic = await prisma.clinic.create({
    data: {
      id: "clinic_mehta_01",
      name: "Dr. Mehta Family Clinic & Diagnostic Centre",
      slug: "mehta-clinic",
      phone: "+91 98200 12345",
      email: "contact@mehtaclinic.com",
      address: "Shop 12, Sunrise Arcade, MG Road, Mumbai, Maharashtra 400001",
      emergencyPhone: "+91 98200 99999",
      setupPrice: 25000,
      currency: "INR",
      timezone: "Asia/Kolkata",
      reminderLeadMinutes: 60,
      reportHour: 21,
      languages: "English, Hindi, Hinglish",
      n8nWebhookUrl: "http://localhost:5678/webhook/clinic-booking",
      whatsappPhoneNumberId: "109823487192837",
    },
  });

  // Secondary Clinic for Multi-Clinic demonstration
  const apolloDental = await prisma.clinic.create({
    data: {
      id: "clinic_apollo_02",
      name: "Apollo Dental & Wellness Care",
      slug: "apollo-dental",
      phone: "+91 98111 22334",
      email: "info@apollodental.com",
      address: "4th Floor, Platinum Plaza, Indiranagar, Bengaluru 560038",
      emergencyPhone: "+91 98111 00000",
      setupPrice: 25000,
      currency: "INR",
      timezone: "Asia/Kolkata",
      reminderLeadMinutes: 60,
      reportHour: 21,
      languages: "English, Kannada, Hindi",
      n8nWebhookUrl: "http://localhost:5678/webhook/apollo-booking",
    },
  });

  console.log("✅ Seeded Clinics");

  // 2. Create Doctors for Mehta Clinic
  const drMehta = await prisma.doctor.create({
    data: {
      id: "doc_mehta_01",
      clinicId: mehtaClinic.id,
      name: "Dr. Rajesh Mehta",
      specialty: "Senior General Physician & Diabetologist",
      calendarId: "dr.mehta.clinic@gmail.com",
      workingDays: "Mon,Tue,Wed,Thu,Fri,Sat",
      startTime: "10:00",
      endTime: "17:30",
      slotMinutes: 30,
      isActive: true,
    },
  });

  const drSharma = await prisma.doctor.create({
    data: {
      id: "doc_sharma_02",
      clinicId: mehtaClinic.id,
      name: "Dr. Sunita Sharma",
      specialty: "Consultant Pediatrician",
      calendarId: "dr.sharma.clinic@gmail.com",
      workingDays: "Mon,Tue,Wed,Thu,Fri",
      startTime: "10:00",
      endTime: "16:00",
      slotMinutes: 30,
      isActive: true,
    },
  });

  const drRao = await prisma.doctor.create({
    data: {
      id: "doc_rao_03",
      clinicId: mehtaClinic.id,
      name: "Dr. Anand Rao",
      specialty: "Cardiologist & Hypertension Specialist",
      calendarId: "dr.rao.clinic@gmail.com",
      workingDays: "Mon,Wed,Fri",
      startTime: "11:00",
      endTime: "18:00",
      slotMinutes: 30,
      isActive: true,
    },
  });

  const drIyer = await prisma.doctor.create({
    data: {
      id: "doc_iyer_04",
      clinicId: mehtaClinic.id,
      name: "Dr. Priya Iyer",
      specialty: "Orthopedic & Joint Specialist",
      calendarId: "dr.iyer.clinic@gmail.com",
      workingDays: "Tue,Thu,Sat",
      startTime: "09:30",
      endTime: "15:30",
      slotMinutes: 30,
      isActive: true,
    },
  });

  // Doctor for Apollo Clinic
  await prisma.doctor.create({
    data: {
      id: "doc_kulkarni_05",
      clinicId: apolloDental.id,
      name: "Dr. Vivek Kulkarni",
      specialty: "Chief Dental Surgeon",
      calendarId: "dr.kulkarni.dental@gmail.com",
      workingDays: "Mon,Tue,Wed,Thu,Fri,Sat",
      startTime: "10:00",
      endTime: "19:00",
      slotMinutes: 45,
      isActive: true,
    },
  });

  console.log("✅ Seeded Doctors");

  // 3. Seed 45+ Realistic Appointments for Mehta Clinic
  const today = new Date();
  const doctorsList = [drMehta, drSharma, drRao, drIyer];

  const samplePatients = [
    { name: "Rahul Verma", phone: "+91 98201 11223", problem: "Viral fever & body ache" },
    { name: "Priya Patel", phone: "+91 98202 22334", problem: "Routine blood pressure follow-up" },
    { name: "Amit Shah", phone: "+91 98203 33445", problem: "Persistent throat pain and cough" },
    { name: "Sneha Joshi", phone: "+91 98204 44556", problem: "Child 6-month vaccination & growth review" },
    { name: "Vikram Malhotra", phone: "+91 98205 55667", problem: "Left knee acute pain & swelling" },
    { name: "Ananya Roy", phone: "+91 98206 66778", problem: "Severe migraine with visual aura" },
    { name: "Rajesh Kulkarni", phone: "+91 98207 77889", problem: "Diabetic HbA1c consultation" },
    { name: "Pooja Gupta", phone: "+91 98208 88990", problem: "Stomach infection & food poisoning symptoms" },
    { name: "Rohit Shinde", phone: "+91 98209 99001", problem: "Chest tightness after morning walk" },
    { name: "Sunita Deshmukh", phone: "+91 98210 10112", problem: "Lower back ache radiating to leg" },
    { name: "Karan Johar", phone: "+91 98211 21223", problem: "Routine annual health check-up" },
    { name: "Neha Chawla", phone: "+91 98212 32334", problem: "Pediatric fever for 3 days" },
    { name: "Manoj Bajpayee", phone: "+91 98213 43445", problem: "Post-surgery joint checkup" },
    { name: "Kavita Nair", phone: "+91 98214 54556", problem: "Allergic rhinitis and sinus pain" },
    { name: "Deepak Chopra", phone: "+91 98215 65667", problem: "ECG review & palpitations" },
    { name: "Ritu Singhania", phone: "+91 98216 76778", problem: "Sprained right ankle while running" },
    { name: "Gaurav Kapur", phone: "+91 98217 87889", problem: "High fever 102F and chills" },
    { name: "Divya Nambiar", phone: "+91 98218 98990", problem: "Thyroid medication adjustment" },
    { name: "Suresh Prabhu", phone: "+91 98219 09001", problem: "Pediatric ear infection" },
    { name: "Meera Sen", phone: "+91 98220 19112", problem: "Cervical spondylosis neck stiffness" },
    { name: "Harish Shetty", phone: "+91 98221 29223", problem: "High fasting blood sugar" },
    { name: "Bhavna Parekh", phone: "+91 98222 39334", problem: "Dry cough & wheezing" },
    { name: "Arjun Rampal", phone: "+91 98223 49445", problem: "Sports injury in shoulder" },
    { name: "Preeti Shenoy", phone: "+91 98224 59556", problem: "Child stomach ache" },
    { name: "Tanmay Bhat", phone: "+91 98225 69667", problem: "Gastric reflux and heartburn" },
    { name: "Sanya Mirza", phone: "+91 98226 79778", problem: "Tennis elbow consultation" },
    { name: "Nitin Gadkari", phone: "+91 98227 89889", problem: "Hypertension medication renewal" },
    { name: "Farah Khan", phone: "+91 98228 99990", problem: "Viral rash on arms" },
    { name: "Kunal Kamra", phone: "+91 98229 09901", problem: "Asthma inhaler assessment" },
    { name: "Zoya Akhtar", phone: "+91 98230 19912", problem: "Vitamin D deficiency bone ache" },
  ];

  const timeSlots = [
    { start: "10:00", end: "10:30" },
    { start: "10:30", end: "11:00" },
    { start: "11:00", end: "11:30" },
    { start: "11:30", end: "12:00" },
    { start: "12:00", end: "12:30" },
    { start: "14:00", end: "14:30" },
    { start: "14:30", end: "15:00" },
    { start: "15:00", end: "15:30" },
    { start: "15:30", end: "16:00" },
    { start: "16:00", end: "16:30" },
    { start: "16:30", end: "17:00" },
  ];

  let aptIndex = 1;

  // Past 3 days, today, next 3 days
  for (let offset = -3; offset <= 3; offset++) {
    const targetDate = offset === 0 ? today : offset < 0 ? subDays(today, Math.abs(offset)) : addDays(today, offset);
    const dateStr = format(targetDate, "yyyy-MM-dd");

    // Seed 6-8 appointments per day
    const appointmentsPerDay = offset === 0 ? 9 : 7;

    for (let i = 0; i < appointmentsPerDay; i++) {
      const patient = samplePatients[(aptIndex * 3) % samplePatients.length];
      const doc = doctorsList[i % doctorsList.length];
      const slot = timeSlots[i % timeSlots.length];

      let status = "Booked";
      if (offset < 0) {
        status = i % 5 === 0 ? "Cancelled" : i % 7 === 0 ? "No-show" : "Completed";
      } else if (offset === 0) {
        status = i === 2 ? "Cancelled" : "Booked";
      }

      const aptId = `APT-${dateStr.replace(/-/g, "")}-${String(aptIndex).padStart(4, "0")}`;

      await prisma.appointment.create({
        data: {
          id: aptId,
          clinicId: mehtaClinic.id,
          doctorId: doc.id,
          patientName: patient.name,
          phone: patient.phone,
          problem: patient.problem,
          date: dateStr,
          startTime: slot.start,
          endTime: slot.end,
          status,
          calendarEventId: `gcal_evt_${aptId.toLowerCase()}`,
          reminderSent: offset <= 0,
          reminderSentAt: offset <= 0 ? new Date() : null,
          source: i % 4 === 0 ? "Phone" : "WhatsApp",
          notes: i % 3 === 0 ? "Patient requested morning slot" : null,
        },
      });

      aptIndex++;
    }
  }

  console.log(`✅ Seeded ${aptIndex - 1} Appointments`);

  // 4. Seed WhatsApp Conversations with realistic states
  const conversationsData = [
    {
      phone: "+91 98201 11223",
      state: "CONFIRMED",
      collectedJson: JSON.stringify({
        patient_name: "Rahul Verma",
        problem: "Viral fever & body ache",
        preferred_date: format(today, "yyyy-MM-dd"),
        doctor: "Dr. Rajesh Mehta",
        chosen_slot: "11:30 AM",
      }),
      transcript: JSON.stringify([
        { sender: "patient", text: "Hi, doctor ki appointment chahiye", time: "10:12 AM" },
        { sender: "bot", text: "Namaste! Dr. Mehta Family Clinic mein swagat hai. Aapka naam, problem aur date bata dijiye.", time: "10:12 AM" },
        { sender: "patient", text: "Mera naam Rahul Verma hai, fever hai 2 din se, aaj dekh sakte hain?", time: "10:13 AM" },
        { sender: "bot", text: "Dr. Rajesh Mehta ke aaj ke free slots:\n1) 10:00 AM\n2) 11:30 AM\n3) 04:00 PM\n4) 05:30 PM\n\nKaunsa time comfortable rahega?", time: "10:13 AM" },
        { sender: "patient", text: "11:30 AM confirm kar do please", time: "10:14 AM" },
        { sender: "bot", text: "Aapki appointment Dr. Rajesh Mehta ke saath aaj 11:30 AM par confirm ho gayi hai! Google Calendar mein add kar diya gaya hai. Appointment se 1 ghante pehle reminder bhejenge.", time: "10:14 AM" },
      ]),
    },
    {
      phone: "+91 98205 55667",
      state: "SLOTS_SENT",
      collectedJson: JSON.stringify({
        patient_name: "Vikram Malhotra",
        problem: "Left knee acute pain",
        preferred_date: format(addDays(today, 1), "yyyy-MM-dd"),
        doctor: "Dr. Priya Iyer",
      }),
      transcript: JSON.stringify([
        { sender: "patient", text: "Orthopedic doctor available hain kal?", time: "11:45 AM" },
        { sender: "bot", text: "Namaste! Dr. Priya Iyer (Orthopedic Specialist) kal available hain. Aapka shubh naam aur problem bata dijiye.", time: "11:45 AM" },
        { sender: "patient", text: "Vikram Malhotra, left knee me dard hai", time: "11:46 AM" },
        { sender: "bot", text: "Kal ke available slots for Dr. Priya Iyer:\n1) 10:30 AM\n2) 12:00 PM\n3) 02:30 PM\n\nKripya apna preferred slot chuniye.", time: "11:46 AM" },
      ]),
    },
    {
      phone: "+91 98209 99001",
      state: "ESCALATED",
      isEscalated: true,
      collectedJson: JSON.stringify({
        patient_name: "Rohit Shinde",
        problem: "Severe chest tightness and breathing difficulty",
      }),
      transcript: JSON.stringify([
        { sender: "patient", text: "Mujhe bohot severe chest pain aur saans lene me dikkat ho rahi hai", time: "01:20 PM" },
        { sender: "bot", text: "⚠️ APATKALIN CHETAVANI / EMERGENCY: Yadi aapko severe chest pain ya saans lene me dikkat hai, kripya turant hamare emergency desk par call karein: +91 98200 99999 ya nazdiki hospital emergency room jayein. Humne reception staff ko bhi alert kar diya hai.", time: "01:20 PM" },
      ]),
    },
    {
      phone: "+91 98204 44556",
      state: "COLLECTING_DETAILS",
      collectedJson: JSON.stringify({
        patient_name: "Sneha Joshi",
      }),
      transcript: JSON.stringify([
        { sender: "patient", text: "Dr. Sharma se milna hai", time: "02:15 PM" },
        { sender: "bot", text: "Namaste! Dr. Sunita Sharma (Pediatrician) ke liye appointment book kar sakte hain. Kripya patient ka naam aur kis date par aana chahte hain batayein?", time: "02:15 PM" },
        { sender: "patient", text: "Sneha Joshi", time: "02:16 PM" },
        { sender: "bot", text: "Dhanyawad Sneha ji. Bachhe ki kya takleef hai aur kis date par consultation chahiye?", time: "02:16 PM" },
      ]),
    },
    {
      phone: "+91 98212 32334",
      state: "CANCELLED",
      collectedJson: JSON.stringify({
        patient_name: "Neha Chawla",
        problem: "Pediatric fever",
        preferred_date: format(today, "yyyy-MM-dd"),
      }),
      transcript: JSON.stringify([
        { sender: "patient", text: "Maine 2 baje ka slot book kiya tha, cancel karna hai", time: "09:30 AM" },
        { sender: "bot", text: "Aapki aaj 2:00 PM ki appointment cancel kar di gayi hai aur calendar update ho gaya hai. Dobara book karne ke liye 'Book' likhein.", time: "09:31 AM" },
      ]),
    },
  ];

  for (const conv of conversationsData) {
    await prisma.conversation.create({
      data: {
        clinicId: mehtaClinic.id,
        phone: conv.phone,
        state: conv.state,
        isEscalated: conv.isEscalated ?? false,
        collectedJson: conv.collectedJson,
        transcript: conv.transcript,
        lastMessageAt: new Date(),
      },
    });
  }

  console.log("✅ Seeded Conversations");

  // 5. Seed 7-Day Daily Report Logs for Analytics & Charts
  for (let i = 6; i >= 0; i--) {
    const reportDate = format(subDays(today, i), "yyyy-MM-dd");
    const booked = 45 + Math.floor(Math.random() * 15);
    const cancelled = 2 + Math.floor(Math.random() * 4);
    const upcoming = i === 0 ? 12 : 0;

    await prisma.dailyReportLog.create({
      data: {
        clinicId: mehtaClinic.id,
        date: reportDate,
        bookedCount: booked,
        cancelledCount: cancelled,
        upcomingCount: upcoming,
        emailSent: i > 0,
        emailSentAt: i > 0 ? new Date() : null,
        detailsJson: JSON.stringify({
          timeSavedHours: "5.5",
          remindersSent: booked - cancelled,
          doubleBookingsPrevented: 3 + Math.floor(Math.random() * 3),
        }),
      },
    });
  }

  console.log("✅ Seeded Daily Reports");

  // 6. Seed Sample Leads
  await prisma.lead.createMany({
    data: [
      {
        clinicName: "Sanjeevani PolyClinic",
        contactPerson: "Dr. Alok Verma",
        phone: "+91 98700 33441",
        email: "alok@sanjeevanipolyclinic.com",
        doctorsCount: 3,
        dailyVolume: 65,
        message: "Need instant WhatsApp automated booking for 3 doctors with Google Calendar sync.",
        status: "NEW",
      },
      {
        clinicName: "Care & Cure Child Clinic",
        contactPerson: "Dr. Shalini Saxena",
        phone: "+91 98700 88992",
        email: "shalini@carecureclinic.org",
        doctorsCount: 2,
        dailyVolume: 45,
        message: "Currently losing 20+ patient inquiries daily on WhatsApp after 7 PM.",
        status: "CONTACTED",
      },
    ],
  });

  console.log("✅ Seeded Leads");
  console.log("🎉 Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
