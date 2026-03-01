# EmailJS Setup - Οδηγίες Ρύθμισης

## Βήμα 1: Δημιουργία λογαριασμού EmailJS

1. Πήγαινε στο https://www.emailjs.com/
2. Δημιούργησε δωρεάν λογαριασμό
3. Ο δωρεάν πλάνος επιτρέπει 200 emails/μήνα

## Βήμα 2: Προσθήκη Email Service (Gmail)

1. Στο Dashboard, πήγαινε στο "Email Services"
2. Κάνε click "Add New Service"
3. Επίλεξε "Gmail"
4. Συνδέσου με το Gmail account σου (bakolasn@gmail.com)
5. **Αντίγραφο το Service ID** που θα σου δώσει

## Βήμα 3: Δημιουργία Email Template

1. Πήγαινε στο "Email Templates"
2. Κάνε click "Create New Template"
3. Στο "To Email" βάλε: `bakolasn@gmail.com`
4. Στο Subject βάλε: `Νέα Κράτηση Ραντεβού - {{booking_date}}`
5. Στο Message Body βάλε:

```
Νέα Κράτηση Ραντεβού

Όνομα: {{from_name}}
Email: {{from_email}}

Ημερομηνία: {{booking_date}}
Ώρα: {{booking_time}}

Μήνυμα:
{{message}}

---
Αυτό το email στάλθηκε από τη φόρμα επικοινωνίας.
```

6. **Αντίγραφο το Template ID** που θα σου δώσει

## Βήμα 4: Public Key

1. Πήγαινε στο "Account" → "General"
2. **Αντίγραφο το Public Key**

## Βήμα 5: Ρύθμιση στο Project

1. Δημιούργησε ένα αρχείο `.env` στη root του project
2. Πρόσθεσε τα εξής (με τα δικά σου IDs):

```env
VITE_EMAILJS_SERVICE_ID=service_xxxxx
VITE_EMAILJS_TEMPLATE_ID=template_xxxxx
VITE_EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxx
```

3. **ΠΡΟΣΟΧΗ**: Το `.env` file ΔΕΝ πρέπει να ανέβει στο Git. Είναι ήδη στο .gitignore

4. Restart το dev server: `npm run dev`

## Εναλλακτικά: Hardcode τα credentials

Αν δεν θες να χρησιμοποιήσεις environment variables, μπορείς να αλλάξεις στον κώδικα:

```javascript
const SERVICE_ID = 'service_xxxxx';
const TEMPLATE_ID = 'template_xxxxx';
const PUBLIC_KEY = 'xxxxxxxxxxxxx';
```

**Σημείωση**: Αν hardcode τα credentials, μην τα ανεβάσεις στο Git!

## Δοκιμή

1. Άνοιξε τη φόρμα επικοινωνίας
2. Επίλεξε ημερομηνία και ώρα
3. Συμπλήρωσε τη φόρμα
4. Submit
5. Έλεγξε το inbox του bakolasn@gmail.com

## Αντιμετώπιση Προβλημάτων

- **"Invalid Public Key"**: Έλεγξε ότι το Public Key είναι σωστό
- **"Template not found"**: Έλεγξε ότι το Template ID είναι σωστό
- **"Service not found"**: Έλεγξε ότι το Service ID είναι σωστό
- **Emails δεν έρχονται**: Έλεγξε το spam folder και ότι το Gmail service είναι ενεργό στο EmailJS

