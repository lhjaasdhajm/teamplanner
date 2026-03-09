import { 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isMonday, 
  isTuesday,
  isWednesday,
  isThursday,
  isFriday,
  isSameMonth, 
  addWeeks, 
  startOfWeek, 
  addDays,
  isWithinInterval,
  format,
  isSameDay,
  startOfISOWeek,
  endOfISOWeek,
  eachWeekOfInterval,
  getMonth,
  getYear,
  setMonth,
  setDay
} from 'date-fns';

export type Frequency = 'Dagelijks' | 'Wekelijks' | 'Maandelijks' | 'Per kwartaal' | 'Per 4 maanden' | 'Jaarlijks';

export interface Task {
  id: string;
  client: string;
  title: string;
  category: string;
  frequency: Frequency;
  frequencyDetail?: string;
  assignee: string;
}

export interface ScheduledTask extends Task {
  date: Date;
  instanceId: string; // Unique ID for this specific occurrence (taskId-date)
}

export const TASKS: Task[] = [
  { id: '1', client: 'MMM', title: 'Mailbox bijwerken', category: 'Mailbox', frequency: 'Dagelijks', assignee: 'Frans' },
  { id: '2', client: 'MMM', title: 'SpendCloud bijwerken', category: 'Inkopen', frequency: 'Dagelijks', assignee: 'Frans' },
  { id: '3', client: 'MMM', title: 'Bank coderen', category: 'Bank', frequency: 'Wekelijks', frequencyDetail: 'Maandag', assignee: 'Frans' },
  { id: '4', client: 'MMM', title: 'Inkoopfacturen betalen', category: 'Inkopen', frequency: 'Wekelijks', frequencyDetail: 'Maandag', assignee: 'Frans' },
  { id: '5', client: 'MMM', title: 'Loonjournaalpost inlezen', category: 'Salarissen', frequency: 'Maandelijks', frequencyDetail: 'Laatste week van de maand', assignee: 'Frans' },
  { id: '6', client: 'MMM', title: 'Crediteurenbeheer', category: 'Inkopen', frequency: 'Maandelijks', frequencyDetail: 'Laatste week van de maand', assignee: 'Frans' },
  { id: '7', client: 'MMM', title: 'Kas boeken', category: 'Kas', frequency: 'Maandelijks', frequencyDetail: 'Eerste week van de volgende maand', assignee: 'Frans' },
  { id: '8', client: 'MMM', title: 'Caseware', category: 'Afsluiting', frequency: 'Maandelijks', frequencyDetail: 'Tweede week van de volgende maand', assignee: 'Frans' },
  
  { id: '9', client: 'Cliëntenbelang', title: 'Mailbox bijwerken', category: 'Mailbox', frequency: 'Dagelijks', assignee: 'Frans' },
  { id: '10', client: 'Cliëntenbelang', title: 'SpendCloud bijwerken', category: 'Inkopen', frequency: 'Dagelijks', assignee: 'Frans' },
  { id: '11', client: 'Cliëntenbelang', title: 'Bank coderen', category: 'Bank', frequency: 'Wekelijks', frequencyDetail: 'Donderdag', assignee: 'Frans' },
  { id: '12', client: 'Cliëntenbelang', title: 'Inkoopfacturen betalen', category: 'Inkopen', frequency: 'Wekelijks', frequencyDetail: 'Donderdag', assignee: 'Frans' },
  { id: '13', client: 'Cliëntenbelang', title: 'Loonjournaalpost inlezen', category: 'Salarissen', frequency: 'Maandelijks', frequencyDetail: 'Laatste week van de maand', assignee: 'Frans' },
  { id: '14', client: 'Zorg voor Zuid', title: 'Loonheffing in SpendCloud', category: 'Salarissen', frequency: 'Maandelijks', frequencyDetail: 'Laatste week van de maand', assignee: 'Rens' },
  { id: '15', client: 'Cliëntenbelang', title: 'Crediteurenbeheer', category: 'Inkopen', frequency: 'Maandelijks', frequencyDetail: 'Laatste week van de maand', assignee: 'Frans' },
  { id: '16', client: 'Cliëntenbelang', title: 'Debiteurenbeheer', category: 'Inkopen', frequency: 'Maandelijks', frequencyDetail: 'Laatste week van de maand', assignee: 'Frans' },
  { id: '17', client: 'Cliëntenbelang', title: 'Facturatie uren @ zorgkantoren', category: 'Facturatie', frequency: 'Maandelijks', frequencyDetail: 'Eerste week van de volgende maand', assignee: 'Frans' },
  { id: '18', client: 'Cliëntenbelang', title: 'Vrijwilligersvergoeding betalen', category: 'Bank', frequency: 'Maandelijks', frequencyDetail: 'Eerste week van de volgende maand', assignee: 'Frans' },
  { id: '19', client: 'Cliëntenbelang', title: 'Caseware', category: 'Afsluiting', frequency: 'Maandelijks', frequencyDetail: 'Tweede week van de volgende maand', assignee: 'Frans' },
  { id: '20', client: 'Cliëntenbelang', title: 'Facturatie uren @ samenwerkingsverbanden', category: 'Facturatie', frequency: 'Per kwartaal', frequencyDetail: 'de eerste week van de maand na afloop van een kwartaal', assignee: 'Frans' },
  { id: '21', client: 'Cliëntenbelang', title: 'Vrijwilligers vergoeding klaar zetten voor automatische betaling', category: 'Bank', frequency: 'Jaarlijks', frequencyDetail: 'De laatst week voor kerstmis', assignee: 'Frans' },
  { id: '22', client: 'Cliëntenbelang', title: 'Projecten omzetten in SpendCloud', category: 'Inkopen', frequency: 'Jaarlijks', frequencyDetail: 'De eerste week van het nieuwe kalenderjaar', assignee: 'Frans' },

  { id: '23', client: 'AHA', title: 'Mailbox bijwerken', category: 'Mailbox', frequency: 'Dagelijks', assignee: 'Frans' },
  { id: '24', client: 'AHA', title: 'SpendCloud bijwerken', category: 'Inkopen', frequency: 'Dagelijks', assignee: 'Frans' },
  { id: '25', client: 'AHA', title: 'Bank coderen', category: 'Bank', frequency: 'Wekelijks', frequencyDetail: 'Woensdag', assignee: 'Frans' },
  { id: '26', client: 'AHA', title: 'Inkoopfacturen betalen', category: 'Inkopen', frequency: 'Wekelijks', frequencyDetail: 'Woensdag', assignee: 'Frans' },
  { id: '27', client: 'AHA', title: 'Loonjournaalpost inlezen', category: 'Salarissen', frequency: 'Maandelijks', frequencyDetail: 'Laatste week van de maand', assignee: 'Frans' },
  { id: '28', client: 'AHA', title: 'Crediteurenbeheer', category: 'Inkopen', frequency: 'Maandelijks', frequencyDetail: 'Laatste week van de maand', assignee: 'Frans' },
  { id: '29', client: 'AHA', title: 'Caseware', category: 'Afsluiting', frequency: 'Maandelijks', frequencyDetail: 'Tweede week van de volgende maand', assignee: 'Frans' },
  { id: '30', client: 'AHA', title: 'Facturen onderweg', category: 'Afsluiting', frequency: 'Per 4 maanden', frequencyDetail: '10e werkdag van de eerste maand, na het verstrijken van 4 maanden', assignee: 'Frans' },

  { id: '31', client: 'Huisartsen+Punt', title: 'Mailbox bijwerken', category: 'Mailbox', frequency: 'Dagelijks', assignee: 'Frans' },
  { id: '32', client: 'Huisartsen+Punt', title: 'SpendCloud bijwerken', category: 'Inkopen', frequency: 'Dagelijks', assignee: 'Frans' },
  { id: '33', client: 'Huisartsen+Punt', title: 'Bank coderen', category: 'Bank', frequency: 'Wekelijks', frequencyDetail: 'Woensdag', assignee: 'Frans' },
  { id: '34', client: 'Huisartsen+Punt', title: 'Inkoopfacturen betalen', category: 'Inkopen', frequency: 'Wekelijks', frequencyDetail: 'Woensdag', assignee: 'Frans' },
  { id: '35', client: 'Huisartsen+Punt', title: 'Loonjournaalpost inlezen', category: 'Salarissen', frequency: 'Maandelijks', frequencyDetail: 'Laatste week van de maand', assignee: 'Frans' },
  { id: '36', client: 'Huisartsen+Punt', title: 'Crediteurenbeheer', category: 'Inkopen', frequency: 'Maandelijks', frequencyDetail: 'Laatste week van de maand', assignee: 'Frans' },
  { id: '37', client: 'Huisartsen+Punt', title: 'Factruatie CAK', category: 'Facturatie', frequency: 'Maandelijks', frequencyDetail: 'Eerste week van de volgende maand', assignee: 'Frans' },
  { id: '38', client: 'Huisartsen+Punt', title: 'Caseware', category: 'Afsluiting', frequency: 'Maandelijks', frequencyDetail: 'Tweede week van de volgende maand', assignee: 'Frans' },
  { id: '39', client: 'Huisartsen+Punt', title: 'Facturatie vergoedingoverzichten uit DIZOSS voor ketenzorg en WLZ', category: 'Facturatie', frequency: 'Per kwartaal', frequencyDetail: 'de eerste week van de maand na afloop van een kwartaal', assignee: 'Frans' },
  { id: '40', client: 'Huisartsen+Punt', title: 'Facturen onderweg', category: 'Afsluiting', frequency: 'Per kwartaal', frequencyDetail: '10e werkdag van de eerste maand, na afloop van een kwartaal', assignee: 'Frans' },
  
  { id: '41', client: 'Zorg voor Zuid', title: 'Mailbox bijwerken', category: 'Mailbox', frequency: 'Dagelijks', assignee: 'Rens' },
  { id: '42', client: 'Zorg voor Zuid', title: 'SpendCloud bijwerken', category: 'Inkopen', frequency: 'Dagelijks', assignee: 'Rens' },
  { id: '43', client: 'Zorg voor Zuid', title: 'Bank coderen', category: 'Bank', frequency: 'Wekelijks', frequencyDetail: 'Vrijdag', assignee: 'Rens' },
  { id: '44', client: 'Zorg voor Zuid', title: 'Inkoopfacturen betalen', category: 'Inkopen', frequency: 'Wekelijks', frequencyDetail: 'Vrijdag', assignee: 'Rens' },
  { id: '45', client: 'Zorg voor Zuid', title: 'Betalen salarissen', category: 'Salarissen', frequency: 'Maandelijks', frequencyDetail: 'Vanaf de 18e en voor de 21e', assignee: 'Rens' },
  { id: '46', client: 'Zorg voor Zuid', title: 'Crediteurenbeheer', category: 'Inkopen', frequency: 'Maandelijks', frequencyDetail: 'Laatste week van de maand', assignee: 'Rens' },
  { id: '47', client: 'Zorg voor Zuid', title: 'Caseware', category: 'Afsluiting', frequency: 'Maandelijks', frequencyDetail: 'Tweede week van de volgende maand', assignee: 'Rens' },
  
  { id: '48', client: 'ZMBR', title: 'Mailbox bijwerken', category: 'Mailbox', frequency: 'Dagelijks', assignee: 'Mustafa' },
  { id: '49', client: 'ZMBR', title: 'SpendCloud codering van facturen beoordelen', category: 'Inkopen', frequency: 'Wekelijks', frequencyDetail: 'Dinsdag', assignee: 'Mustafa' },
  { id: '50', client: 'ZMBR', title: 'Inkoopfacturen betalen', category: 'Inkopen', frequency: 'Wekelijks', frequencyDetail: 'Dinsdag', assignee: 'Mustafa' },
  { id: '51', client: 'ZMBR', title: 'Loonjournaalpost inlezen', category: 'Salarissen', frequency: 'Maandelijks', frequencyDetail: 'Laatste week van de maand', assignee: 'Mustafa' },
  { id: '52', client: 'ZMBR', title: 'Debiteurenbeheer', category: 'Facturatie', frequency: 'Maandelijks', frequencyDetail: 'Laatste week van de maand', assignee: 'Mustafa' },
  { id: '53', client: 'ZMBR', title: 'Bank coderen', category: 'Bank', frequency: 'Maandelijks', frequencyDetail: 'Eerste week van de volgende maand', assignee: 'Mustafa' },
  { id: '54', client: 'ZMBR', title: 'Caseware', category: 'Afsluiting', frequency: 'Maandelijks', frequencyDetail: 'Tweede week van de volgende maand', assignee: 'Mustafa' },
  { id: '55', client: 'ZMBR', title: 'BTW aangifte', category: 'Belasting', frequency: 'Per kwartaal', frequencyDetail: 'de een na laatste week van de maand na afloop van een kwartaal', assignee: 'Erik' },
  
  { id: '56', client: 'Lichtpunt', title: 'Mailbox bijwerken', category: 'Mailbox', frequency: 'Dagelijks', assignee: 'Mustafa' },
  { id: '57', client: 'Lichtpunt', title: 'SpendCloud bijwerken', category: 'Inkopen', frequency: 'Dagelijks', assignee: 'Mustafa' },
  { id: '58', client: 'Lichtpunt', title: 'Bank coderen', category: 'Bank', frequency: 'Wekelijks', frequencyDetail: 'Dinsdag', assignee: 'Mustafa' },
  { id: '59', client: 'Lichtpunt', title: 'Inkoopfacturen betalen', category: 'Inkopen', frequency: 'Wekelijks', frequencyDetail: 'Dinsdag', assignee: 'Mustafa' },
  { id: '60', client: 'Lichtpunt', title: 'Betalen salarissen', category: 'Salarissen', frequency: 'Maandelijks', frequencyDetail: 'Vanaf de 14e en voor de 21e', assignee: 'Mustafa' },
  { id: '61', client: 'Lichtpunt', title: 'Loonheffing in SpendCloud', category: 'Salarissen', frequency: 'Maandelijks', frequencyDetail: 'Laatste week van de maand', assignee: 'Mustafa' },
  { id: '62', client: 'Lichtpunt', title: 'Crediteurenbeheer', category: 'Inkopen', frequency: 'Maandelijks', frequencyDetail: 'Laatste week van de maand', assignee: 'Mustafa' },
  { id: '63', client: 'Lichtpunt', title: 'Voedingsgelden betalen', category: 'Bank', frequency: 'Maandelijks', frequencyDetail: 'Eerste week van de volgende maand', assignee: 'Mustafa' },
  { id: '64', client: 'Lichtpunt', title: 'Productie boeken', category: 'Facturatie', frequency: 'Maandelijks', frequencyDetail: 'Eerste week van de volgende maand', assignee: 'Mustafa' },
  { id: '65', client: 'Lichtpunt', title: 'Kas & Pas afsluiten', category: 'Kas', frequency: 'Maandelijks', frequencyDetail: 'Eerste week van de volgende maand', assignee: 'Mustafa' },
  { id: '66', client: 'Lichtpunt', title: 'Caseware', category: 'Afsluiting', frequency: 'Maandelijks', frequencyDetail: 'Tweede week van de volgende maand', assignee: 'Mustafa' },
  
  // Bergweide
  { id: '117', client: 'Bergweide', title: 'Mailbox bijwerken', category: 'Mailbox', frequency: 'Dagelijks', assignee: 'Mustafa' },
  { id: '118', client: 'Bergweide', title: 'SpendCloud bijwerken', category: 'Inkopen', frequency: 'Dagelijks', assignee: 'Mustafa' },
  { id: '119', client: 'Bergweide', title: 'Bank coderen', category: 'Bank', frequency: 'Wekelijks', frequencyDetail: 'Dinsdag', assignee: 'Mustafa' },
  { id: '120', client: 'Bergweide', title: 'Inkoopfacturen betalen', category: 'Inkopen', frequency: 'Wekelijks', frequencyDetail: 'Dinsdag', assignee: 'Mustafa' },
  { id: '121', client: 'Bergweide', title: 'Betalen salarissen', category: 'Salarissen', frequency: 'Maandelijks', frequencyDetail: 'Vanaf de 15e en voor de 21e', assignee: 'Mustafa' },
  { id: '122', client: 'Bergweide', title: 'Loonheffing in SpendCloud', category: 'Salarissen', frequency: 'Maandelijks', frequencyDetail: 'Laatste week van de maand', assignee: 'Mustafa' },
  { id: '123', client: 'Bergweide', title: 'Loonjournaalpost inlezen', category: 'Salarissen', frequency: 'Maandelijks', frequencyDetail: 'Laatste week van de maand', assignee: 'Mustafa' },
  { id: '124', client: 'Bergweide', title: 'Crediteurenbeheer', category: 'Inkopen', frequency: 'Maandelijks', frequencyDetail: 'Laatste week van de maand', assignee: 'Mustafa' },
  { id: '125', client: 'Bergweide', title: 'Debiteurenbeheer', category: 'Facturatie', frequency: 'Maandelijks', frequencyDetail: 'Laatste week van de maand', assignee: 'Mustafa' },
  { id: '126', client: 'Bergweide', title: 'Kas & Pas afsluiten', category: 'Kas', frequency: 'Maandelijks', frequencyDetail: 'Eerste week van de volgende maand', assignee: 'Mustafa' },
  { id: '127', client: 'Bergweide', title: 'Huren facturen & incasso', category: 'Facturatie', frequency: 'Maandelijks', frequencyDetail: 'De 25e van de maand er voor', assignee: 'Mustafa' },
  { id: '128', client: 'Bergweide', title: 'Factureren Ziggo', category: 'Facturatie', frequency: 'Maandelijks', frequencyDetail: 'Eerste week van de volgende maand', assignee: 'Mustafa' },
  { id: '129', client: 'Bergweide', title: 'Facturerern VPT', category: 'Facturatie', frequency: 'Maandelijks', frequencyDetail: 'Eerste week van de volgende maand', assignee: 'Mustafa' },
  { id: '130', client: 'Bergweide', title: 'Factureren Pedicure Clarahuis', category: 'Facturatie', frequency: 'Maandelijks', frequencyDetail: 'Eerste week van de volgende maand', assignee: 'Mustafa' },
  { id: '131', client: 'Bergweide', title: 'Factureren Wachtdienst en VPT Congregatie', category: 'Facturatie', frequency: 'Maandelijks', frequencyDetail: 'Eerste week van de volgende maand', assignee: 'Mustafa' },
  { id: '132', client: 'Bergweide', title: 'Factureren Restaurant (Compad)', category: 'Facturatie', frequency: 'Maandelijks', frequencyDetail: 'Eerste week van de volgende maand', assignee: 'Mustafa' },
  { id: '133', client: 'Bergweide', title: 'Factureren Huishoudelijke hulp', category: 'Facturatie', frequency: 'Maandelijks', frequencyDetail: 'Eerste week van de volgende maand', assignee: 'Mustafa' },
  { id: '134', client: 'Bergweide', title: 'Facturen onderweg', category: 'Inkopen', frequency: 'Maandelijks', frequencyDetail: 'op de 6e van de maand', assignee: 'Mustafa' },
  { id: '135', client: 'Bergweide', title: 'Productie boeken', category: 'Facturatie', frequency: 'Maandelijks', frequencyDetail: 'Tweede week van de volgende maand', assignee: 'Nicoline' },
  { id: '136', client: 'Bergweide', title: 'Caseware', category: 'Afsluiting', frequency: 'Maandelijks', frequencyDetail: 'Tweede week van de volgende maand', assignee: 'Mustafa' },
  { id: '137', client: 'Bergweide', title: 'Personeelsvereniging betalen', category: 'Bank', frequency: 'Per kwartaal', frequencyDetail: 'de eerste week van de maand na afloop van een kwartaal', assignee: 'Mustafa' },
  { id: '138', client: 'Bergweide', title: 'BTW aangifte', category: 'Belasting', frequency: 'Per kwartaal', frequencyDetail: 'de een na laatste week van de maand na afloop van een kwartaal', assignee: 'Nicoline' },
  { id: '139', client: 'Bergweide', title: 'Factureren Salon Bertine', category: 'Facturatie', frequency: 'Jaarlijks', frequencyDetail: 'eerste week van januari', assignee: 'Mustafa' },
  { id: '140', client: 'Bergweide', title: 'Factureren N. van Boekel', category: 'Facturatie', frequency: 'Jaarlijks', frequencyDetail: 'laatste week van december', assignee: 'Mustafa' },

  // Vitala+
  { id: '141', client: 'Vitala+', title: 'Mailbox bijwerken', category: 'Mailbox', frequency: 'Dagelijks', assignee: 'Mustafa' },
  { id: '142', client: 'Vitala+', title: 'SpendCloud bijwerken', category: 'Inkopen', frequency: 'Dagelijks', assignee: 'Mustafa' },
  { id: '143', client: 'Vitala+', title: 'Bank coderen', category: 'Bank', frequency: 'Wekelijks', frequencyDetail: 'Woensdag', assignee: 'Mustafa' },
  { id: '144', client: 'Vitala+', title: 'Banksaldo doorgeven', category: 'Bank', frequency: 'Wekelijks', frequencyDetail: 'Woensdag', assignee: 'Mustafa' },
  { id: '145', client: 'Vitala+', title: 'Inkoopfacturen betalen', category: 'Inkopen', frequency: 'Wekelijks', frequencyDetail: 'Woensdag', assignee: 'Mustafa' },
  { id: '146', client: 'Vitala+', title: 'Crediteurenbeheer', category: 'Inkopen', frequency: 'Maandelijks', frequencyDetail: 'Laatste week van de maand', assignee: 'Mustafa' },
  { id: '147', client: 'Vitala+', title: 'Debiteurenbeheer', category: 'Facturatie', frequency: 'Maandelijks', frequencyDetail: 'Laatste week van de maand', assignee: 'Mustafa' },
  { id: '148', client: 'Vitala+', title: 'Factureren Envida', category: 'Facturatie', frequency: 'Maandelijks', frequencyDetail: 'Eerste week van de volgende maand', assignee: 'Mustafa' },
  { id: '149', client: 'Vitala+', title: 'Factureren aanleunwoningen Envida', category: 'Facturatie', frequency: 'Maandelijks', frequencyDetail: 'Eerste week van de volgende maand', assignee: 'Mustafa' },
  { id: '150', client: 'Vitala+', title: 'Factureren MUMC', category: 'Facturatie', frequency: 'Maandelijks', frequencyDetail: 'Eerste week van de volgende maand', assignee: 'Mustafa' },
  { id: '151', client: 'Vitala+', title: 'Factureren Netwerk Acute Zorg Limburg', category: 'Facturatie', frequency: 'Maandelijks', frequencyDetail: 'Eerste week van de volgende maand', assignee: 'Mustafa' },
  { id: '152', client: 'Vitala+', title: 'Factureren Fysio Zuid Groep', category: 'Facturatie', frequency: 'Maandelijks', frequencyDetail: 'Eerste week van de volgende maand', assignee: 'Mustafa' },
  { id: '153', client: 'Vitala+', title: 'Facturen onderweg', category: 'Inkopen', frequency: 'Maandelijks', frequencyDetail: 'op de 6e van de maand', assignee: 'Mustafa' },
  { id: '154', client: 'Vitala+', title: 'Productie boeken', category: 'Facturatie', frequency: 'Maandelijks', frequencyDetail: 'Tweede week van de volgende maand', assignee: 'Nicoline' },
  { id: '155', client: 'Vitala+', title: 'Caseware', category: 'Afsluiting', frequency: 'Maandelijks', frequencyDetail: 'Tweede week van de volgende maand', assignee: 'Mustafa' },
  { id: '156', client: 'Vitala+', title: 'Factureren Smile Fitness', category: 'Facturatie', frequency: 'Per kwartaal', frequencyDetail: 'de eerste week van de maand na afloop van een kwartaal', assignee: 'Mustafa' },
  { id: '157', client: 'Vitala+', title: 'Vrijwilligers vergoeding betalen', category: 'Bank', frequency: 'Per kwartaal', frequencyDetail: 'de eerste week van de maand na afloop van een kwartaal', assignee: 'Mustafa' },
  { id: '158', client: 'Vitala+', title: 'BTW aangifte', category: 'Belasting', frequency: 'Per kwartaal', frequencyDetail: 'de een na laatste week van de maand na afloop van een kwartaal', assignee: 'Nicoline' },
];

/**
 * A workweek (Mon-Fri) is the "First week of the month" if at least 3 of 5 days lie in that month.
 */
export function isFirstWeekOfMonth(date: Date, targetMonth: Date): boolean {
  const weekStart = startOfISOWeek(date);
  const workDays = [0, 1, 2, 3, 4].map(d => addDays(weekStart, d));
  const daysInMonth = workDays.filter(d => isSameMonth(d, targetMonth)).length;
  return daysInMonth >= 3;
}

/**
 * A workweek (Mon-Fri) is the "Last week of the month" if at least 3 of 5 days lie in that month.
 */
export function isLastWeekOfMonth(date: Date, targetMonth: Date): boolean {
  const weekStart = startOfISOWeek(date);
  const workDays = [0, 1, 2, 3, 4].map(d => addDays(weekStart, d));
  const daysInMonth = workDays.filter(d => isSameMonth(d, targetMonth)).length;
  return daysInMonth >= 3;
}

export function generateSchedule(month: Date): ScheduledTask[] {
  const schedule: ScheduledTask[] = [];
  const start = startOfMonth(month);
  const end = endOfMonth(month);
  
  // We need to look a bit ahead for "next month" tasks that might fall into the current view
  // and a bit behind for "previous month" tasks.
  // However, the user specifically asked for March 2026.
  
  const days = eachDayOfInterval({ 
    start: addWeeks(start, -2), 
    end: addWeeks(end, 6) 
  });

  const workDays = Array.from(new Set(days.filter(day => isMonday(day) || isTuesday(day) || isWednesday(day) || isThursday(day) || isFriday(day)).map(d => d.getTime()))).map(t => new Date(t));

  TASKS.forEach(task => {
    let workDayCheck = isMonday;
    if (task.assignee === 'Frans') {
      // Frans works Mon, Wed, Thu
      if (task.client === 'MMM') workDayCheck = isMonday;
      else if (task.client === 'AHA' || task.client === 'Huisartsen+Punt') workDayCheck = isWednesday;
      else if (task.client === 'Cliëntenbelang') workDayCheck = isThursday;
    } else if (task.assignee === 'Rens') {
      // Rens works Wed, Fri
      if (task.client === 'Zorg voor Zuid' || task.client === 'Cliëntenbelang') workDayCheck = isFriday;
    } else if (task.assignee === 'Mustafa') {
      // Mustafa works Tue, Wed, Fri
      if (task.client === 'ZMBR' || task.client === 'Lichtpunt' || task.client === 'Bergweide') workDayCheck = isTuesday;
      else if (task.client === 'Vitala+') workDayCheck = isWednesday;
    } else if (task.assignee === 'Nicoline') {
      // Nicoline works for Bergweide and Vitala+
      if (task.client === 'Bergweide') workDayCheck = isTuesday;
      else if (task.client === 'Vitala+') workDayCheck = isWednesday;
    } else if (task.assignee === 'Erik') {
      // Erik works on Tuesdays for ZMBR
      if (task.client === 'ZMBR') workDayCheck = isTuesday;
    }

    if (task.frequency === 'Dagelijks') {
      // Daily tasks appear on the assignee's specific workdays
      workDays.forEach(day => {
        if (!isSameMonth(day, month)) return;
        
        let isAssigneeWorkDay = false;
        if (task.assignee === 'Frans') {
          isAssigneeWorkDay = isMonday(day) || isWednesday(day) || isThursday(day);
        } else if (task.assignee === 'Rens') {
          isAssigneeWorkDay = isWednesday(day) || isFriday(day);
        } else if (task.assignee === 'Mustafa') {
          isAssigneeWorkDay = isTuesday(day) || isWednesday(day) || isFriday(day);
        }

        if (isAssigneeWorkDay) {
          schedule.push({ ...task, date: day, instanceId: `${task.id}-${format(day, 'yyyy-MM-dd')}` });
        }
      });
    } else {
      days.forEach(day => {
        if (!workDayCheck(day)) return;
        
        if (task.frequency === 'Wekelijks') {
          if (isSameMonth(day, month)) {
            schedule.push({ ...task, date: day, instanceId: `${task.id}-${format(day, 'yyyy-MM-dd')}` });
          }
        } else if (task.frequency === 'Maandelijks') {
          if (task.frequencyDetail === 'Laatste week van de maand') {
            if (isLastWeekOfMonth(day, day) && isSameMonth(day, month)) {
              const allWorkDays = days.filter(d => workDayCheck(d) && isSameMonth(d, day) && isLastWeekOfMonth(d, day));
              const lastWorkDay = allWorkDays[allWorkDays.length - 1];
              if (isSameDay(day, lastWorkDay)) {
                schedule.push({ ...task, date: day, instanceId: `${task.id}-${format(day, 'yyyy-MM-dd')}` });
              }
            }
          } else if (task.frequencyDetail === 'Eerste week van de volgende maand') {
            if (isFirstWeekOfMonth(day, day) && isSameMonth(day, month)) {
              const allWorkDays = days.filter(d => workDayCheck(d) && isSameMonth(d, day) && isFirstWeekOfMonth(d, day));
              const firstWorkDay = allWorkDays[0];
              if (isSameDay(day, firstWorkDay)) {
                schedule.push({ ...task, date: day, instanceId: `${task.id}-${format(day, 'yyyy-MM-dd')}` });
              }
            }
          } else if (task.frequencyDetail === 'Tweede week van de volgende maand') {
            if (isSameMonth(day, month)) {
              const allWorkDays = days.filter(d => workDayCheck(d) && isSameMonth(d, day) && isFirstWeekOfMonth(d, day));
              const firstWorkDay = allWorkDays[0];
              if (firstWorkDay && isSameDay(day, addWeeks(firstWorkDay, 1))) {
                schedule.push({ ...task, date: day, instanceId: `${task.id}-${format(day, 'yyyy-MM-dd')}` });
              }
            }
          } else if (task.frequencyDetail === 'Vanaf de 15e en voor de 21e') {
            const dayOfMonth = day.getDate();
            if (dayOfMonth >= 15 && dayOfMonth < 21 && isSameMonth(day, month)) {
              schedule.push({ ...task, date: day, instanceId: `${task.id}-${format(day, 'yyyy-MM-dd')}` });
            }
          } else if (task.frequencyDetail === 'op de 6e van de maand') {
            const dayOfMonth = day.getDate();
            if (dayOfMonth === 6 && isSameMonth(day, month)) {
              schedule.push({ ...task, date: day, instanceId: `${task.id}-${format(day, 'yyyy-MM-dd')}` });
            }
          } else if (task.frequencyDetail === 'De 25e van de maand er voor') {
            // This is complex, but let's approximate: 25th of current month for "next month's" task
            // Or if we are in month M, we look for the 25th of M-1.
            // Actually, if it's "Maandelijks" and "25e of previous month", it means it appears once a month.
            const dayOfMonth = day.getDate();
            if (dayOfMonth === 25 && isSameMonth(day, month)) {
              schedule.push({ ...task, date: day, instanceId: `${task.id}-${format(day, 'yyyy-MM-dd')}` });
            }
          } else if (task.frequencyDetail === 'Vanaf de 18e en voor de 21e') {
            // Find the workday between 18 and 21
            const dayOfMonth = day.getDate();
            if (dayOfMonth >= 18 && dayOfMonth < 21 && isSameMonth(day, month)) {
              schedule.push({ ...task, date: day, instanceId: `${task.id}-${format(day, 'yyyy-MM-dd')}` });
            }
          } else if (task.frequencyDetail === 'Vanaf de 14e en voor de 21e') {
            const dayOfMonth = day.getDate();
            if (dayOfMonth >= 14 && dayOfMonth < 21 && isSameMonth(day, month)) {
              schedule.push({ ...task, date: day, instanceId: `${task.id}-${format(day, 'yyyy-MM-dd')}` });
            }
          }
        } else if (task.frequency === 'Per kwartaal') {
          const targetMonths = [0, 3, 6, 9]; // Jan, Apr, Jul, Oct
          if (targetMonths.includes(getMonth(day))) {
            if (task.frequencyDetail?.includes('10e werkdag')) {
              // 10th workday is roughly 2nd week. We'll pick the 2nd work day of the month.
              const allWorkDays = days.filter(d => workDayCheck(d) && isSameMonth(d, day));
              const secondWorkDay = allWorkDays[1];
              if (isSameDay(day, secondWorkDay) && isSameMonth(day, month)) {
                schedule.push({ ...task, date: day, instanceId: `${task.id}-${format(day, 'yyyy-MM-dd')}` });
              }
            } else if (isFirstWeekOfMonth(day, day)) {
              const allWorkDays = days.filter(d => workDayCheck(d) && isSameMonth(d, day) && isFirstWeekOfMonth(d, day));
              const firstWorkDay = allWorkDays[0];
              if (isSameDay(day, firstWorkDay) && isSameMonth(day, month)) {
                schedule.push({ ...task, date: day, instanceId: `${task.id}-${format(day, 'yyyy-MM-dd')}` });
              }
            } else if (task.frequencyDetail?.includes('een na laatste week')) {
              // Second to last week of the month
              const currentMonth = day;
              if (isLastWeekOfMonth(addWeeks(day, 1), currentMonth)) {
                const allWorkDays = days.filter(d => workDayCheck(d) && isSameMonth(d, day) && isLastWeekOfMonth(addWeeks(d, 1), day));
                const firstWorkDay = allWorkDays[0];
                if (isSameDay(day, firstWorkDay) && isSameMonth(day, month)) {
                  schedule.push({ ...task, date: day, instanceId: `${task.id}-${format(day, 'yyyy-MM-dd')}` });
                }
              }
            }
          }
        } else if (task.frequency === 'Per 4 maanden') {
          // 10e werkdag van de eerste maand, na het verstrijken van 4 maanden
          // Let's assume Jan, May, Sep
          const targetMonths = [0, 4, 8];
          if (targetMonths.includes(getMonth(day))) {
            const allWorkDays = days.filter(d => workDayCheck(d) && isSameMonth(d, day));
            const secondWorkDay = allWorkDays[1]; // 10th workday is roughly 2nd work day if he works once a week
            if (isSameDay(day, secondWorkDay) && isSameMonth(day, month)) {
              schedule.push({ ...task, date: day, instanceId: `${task.id}-${format(day, 'yyyy-MM-dd')}` });
            }
          }
        } else if (task.frequency === 'Jaarlijks') {
          if (task.frequencyDetail === 'eerste week van januari') {
            if (getMonth(day) === 0 && isFirstWeekOfMonth(day, day) && isSameMonth(day, month)) {
              const allWorkDays = days.filter(d => workDayCheck(d) && isSameMonth(d, day) && isFirstWeekOfMonth(d, day));
              const firstWorkDay = allWorkDays[0];
              if (isSameDay(day, firstWorkDay)) {
                schedule.push({ ...task, date: day, instanceId: `${task.id}-${format(day, 'yyyy-MM-dd')}` });
              }
            }
          } else if (task.frequencyDetail === 'laatste week van december') {
            if (getMonth(day) === 11 && isLastWeekOfMonth(day, day) && isSameMonth(day, month)) {
              const allWorkDays = days.filter(d => workDayCheck(d) && isSameMonth(d, day) && isLastWeekOfMonth(d, day));
              const lastWorkDay = allWorkDays[allWorkDays.length - 1];
              if (isSameDay(day, lastWorkDay)) {
                schedule.push({ ...task, date: day, instanceId: `${task.id}-${format(day, 'yyyy-MM-dd')}` });
              }
            }
          } else if (task.frequencyDetail === 'De laatst week voor kerstmis') {
            const dec25 = new Date(getYear(day), 11, 25);
            const weekBeforeChristmas = startOfISOWeek(addDays(dec25, -7));
            if (isSameDay(startOfISOWeek(day), weekBeforeChristmas) && isSameMonth(day, month)) {
              schedule.push({ ...task, date: day, instanceId: `${task.id}-${format(day, 'yyyy-MM-dd')}` });
            }
          } else if (task.frequencyDetail === 'De eerste week van het nieuwe kalenderjaar') {
            const jan1 = new Date(getYear(day), 0, 1);
            if (isFirstWeekOfMonth(day, jan1) && isSameMonth(day, month)) {
              const allWorkDays = days.filter(d => workDayCheck(d) && isSameMonth(d, jan1) && isFirstWeekOfMonth(d, jan1));
              const firstWorkDay = allWorkDays[0];
              if (isSameDay(day, firstWorkDay)) {
                schedule.push({ ...task, date: day, instanceId: `${task.id}-${format(day, 'yyyy-MM-dd')}` });
              }
            }
          }
        }
      });
    }
  });

  return schedule.sort((a, b) => a.date.getTime() - b.date.getTime());
}
