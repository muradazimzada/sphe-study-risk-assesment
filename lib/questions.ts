import type { Question } from "./types"

export const relationshipConcernOptions = [
  "My current husband or partner",
  "My ex-husband or partner",
  "My in-laws",
  "Other family members",
  "Other",
]

export const livingWithOptions = [
  "Husband or partner only",
  "Husband or partner and in-laws",
  "Husband or partner and other family members",
  "Other relatives",
  "Others not related to me",
  "I live alone",
]

export const partnerQuestions: Question[] = [
  {
    id: "1",
    text: "Has the physical violence increased in severity or frequency over the past year?",
    type: "yes-no",
  },
  {
    id: "2",
    text: "Does he own a gun?",
    type: "yes-no",
  },
  {
    id: "3",
    text: "Does he threaten to kill you?",
    type: "yes-no",
  },
  {
    id: "4",
    text: 'Is he violently and constantly jealous of you? For instance, does he say, "If I can\'t have you, no one can."',
    type: "yes-no",
  },
  {
    id: "5",
    text: "Do you feel ashamed of the things he does to you?",
    type: "yes-no",
  },
  {
    id: "6",
    text: "Have you left him after living together during the past year?",
    type: "yes-no",
    subQuestion: {
      id: "6a",
      text: "If you have never lived with him, check here:",
      condition: "no",
      type: "checkbox"
    },
  },
  {
    id: "7",
    text: "Does he prevent you from going to school, or getting job training, or learning English?",
    type: "yes-no",
  },
  {
    id: "8",
    text: "Are you married to him?",
    type: "yes-no",
  },
  {
    id: "9",
    text: "Was your partner born in the United States?",
    type: "yes-no",
  },
  {
    id: "10",
    text: "Has he threatened to report you to child protective services, immigration, or other authorities?",
    type: "yes-no",
  },
  {
    id: "11",
    text: "Has he ever used a weapon against you or threatened you with a lethal weapon?",
    type: "yes-no",
    subQuestion: {
      id: "11a",
      text: "If yes, was the weapon a gun?",
      condition: "yes",
      type: "yes-no",
    },
  },
  {
    id: "12",
    text: "Do you have a child that is not his?",
    type: "yes-no",
  },
  {
    id: "13",
    text: "Has he ever forced you to have sex when you did not wish to do so?",
    type: "yes-no",
  },
  {
    id: "14",
    text: "Does he ever try to choke/strangle you or cut off your breathing?",
    type: "yes-no",
    subQuestion: {
      id: "14a",
      text: "If yes, has he done it more than once, or did it make you pass out or black out or make you dizzy?",
      condition: "yes",
      type: "yes-no",
    },
  },
  {
    id: "15",
    text: "Is he an alcoholic or problem drinker?",
    type: "yes-no",
  },
  {
    id: "16",
    text: "Does he threaten to harm your children?",
    type: "yes-no",
    subQuestion: {
      id: "16a",
      text: "If you don't have children; check here:",
      condition: "yes_no",
      type: "checkbox",
    },
  },
  {
    id: "17",
    text: "Are you unemployed?",
    type: "yes-no",
  },
  {
    id: "18",
    text: "Have you attended college, vocational school and/or graduate school?",
    type: "yes-no",
  },
  {
    id: "19",
    text: "Has he avoided being arrested for domestic violence?",
    type: "yes-no",
  },
  {
    id: "20",
    text: "Have you ever been beaten by him while you were pregnant?",
    type: "yes-no",
    subQuestion: {
      id: "20a",
      text: "If you have never been pregnant by him; check here:",
      condition: "yes_no",
      type: "checkbox",
    },
  },
  {
    id: "21",
    text: "Has he ever threatened or tried to commit suicide?",
    type: "yes-no",
  },
  {
    id: "22",
    text: "Do you believe he is capable of killing you?",
    type: "yes-no",
  },
  {
    id: "23",
    text: "Does he follow or spy on you, leave threatening notes or messages on voicemail, destroy your property, or call you when you don't want him to?",
    type: "yes-no",
  },
  {
    id: "24",
    text: "Do you hide the truth from others because you are afraid of him?",
    type: "yes-no",
  },
  {
    id: "25",
    text: "Do you have any children living with you in your home?",
    type: "yes-no",
  },
  {
    id: "26",
    text: "Do you have any children with him?",
    type: "yes-no",
  },
  {
    id: "27",
    text: "Have you ever threatened or tried to commit suicide?",
    type: "yes-no",
  },
]

export const inLawsQuestions: Question[] = [
  {
    id: "1",
    text: "Has physical violence from your in-laws increased in severity or frequency over the past year?",
    type: "yes-no",
  },
  {
    id: "2",
    text: "Have your in-laws ever threatened to kill you or someone you care about?",
    type: "yes-no",
  },
  {
    id: "3",
    text: "Are your in-laws violently or constantly jealous, possessive, or controlling of you?",
    type: "yes-no",
  },
  {
    id: "4",
    text: "Have your in-laws ever forced or pressured you to have sex against your will?",
    type: "yes-no",
    subQuestion: {
      id: "4a",
      text: "If yes, do other in-laws know about it?",
      condition: "yes",
      type: "yes-no"
    },
  },
  {
    id: "5",
    text: "Have your in-laws ever tried to choke, strangle, or otherwise cut off your breathing?",
    type: "yes-no",
  },
  {
    id: "6",
    text: "Do your in-laws use substances that affect their behavior in ways that make you feel unsafe?",
    type: "yes-no",
  },
  {
    id: "7",
    text: "Have your in-laws ever made false accusations about you that caused harm or conflict?",
    type: "yes-no",
  },
  {
    id: "8",
    text: "Do your in-laws try to prevent or limit your contact with your own family, friends, or support system?",
    type: "yes-no",
  },
  {
    id: "9",
    text: "Have your in-laws ever locked you in a room or prevented you from leaving a place?",
    type: "yes-no",
  },
  {
    id: "10",
    text: "Have you ever been abused by your in-laws because of infertility or not becoming pregnant?",
    type: "yes-no",
  },
  {
    id: "11",
    text: "Have you experienced abuse from your in-laws over dowry, bride price, or other marriage-related financial issues?",
    type: "yes-no",
  },
]

export const familyQuestions: Question[] = [
  {
    id: "1",
    text: "Has physical violence from your family members increased in severity or frequency over the past year?",
    type: "yes-no",
  },
  {
    id: "2",
    text: "Have any family members ever threatened to kill you or someone you care about?",
    type: "yes-no",
  },
  {
    id: "3",
    text: "Are any family members violently or constantly jealous, possessive, or controlling of you?",
    type: "yes-no",
  },
  {
    id: "4",
    text: "Has any family member ever forced or pressured you to have sex against your will?",
    type: "yes-no",
    subQuestion: {
      id: "4a",
      text: "If yes, do other family members know about it?",
      condition: "yes",
      type: "yes-no"
    },
  },
  {
    id: "5",
    text: "Has any family member ever tried to choke, strangle, or otherwise cut off your breathing?",
    type: "yes-no",
  },
  {
    id: "6",
    text: "Do any family members use substances that affect their behavior in ways that make you feel unsafe?",
    type: "yes-no",
  },
  {
    id: "7",
    text: "Have family members ever made false accusations about you that caused harm or conflict?",
    type: "yes-no",
  },
  {
    id: "8",
    text: "Do any family members try to prevent or limit your contact with friends, other family, or support systems?",
    type: "yes-no",
  },
  {
    id: "9",
    text: "Has a family member ever locked you in a room or kept you from leaving a place?",
    type: "yes-no",
  },
  {
    id: "10",
    text: "Have you ever been abused by family members because of infertility or not becoming pregnant?",
    type: "yes-no",
  },
  {
    id: "11",
    text: "Have you experienced abuse from family members over dowry, bride price, or other financial pressures related to marriage?",
    type: "yes-no",
  },
]
