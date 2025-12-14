import { TemplateConfig } from '@/types/template';

export const CANVAS_WIDTH = 1080;
export const CANVAS_HEIGHT = 1080;

// Template configurations - svgSelectors will be updated once we analyze the SVG structure
export const templateConfigs: TemplateConfig[] = [
  {
    id: 'robot-update',
    name: 'Robot Updates',
    description: 'Share robot progress and updates',
    svgPath: '/templates/robot-update.svg',
    fields: [
      {
        id: 'title',
        label: 'Title',
        placeholder: 'Robot Update Title',
        svgSelector: '[data-field="title"]',
      },
      {
        id: 'bodyText',
        label: 'Body Text',
        placeholder: 'Add update details...',
        svgSelector: '[data-field="body"]',
        multiline: true,
      },
    ],
    imageZones: [
      {
        id: 'mainImage',
        label: 'Main Photo',
        svgSelector: '[data-image="main"]',
      },
    ],
  },
  {
    id: 'subteam-week',
    name: 'Subteam of the Week',
    description: 'Highlight a subteam and their work',
    svgPath: '/templates/subteam-week.svg',
    fields: [
      {
        id: 'subteamName',
        label: 'Subteam Name',
        placeholder: 'SUBTEAM',
        svgSelector: '[data-field="subteam"]',
      },
    ],
    imageZones: [
      {
        id: 'photo1',
        label: 'Left Photo',
        svgSelector: '[data-image="photo1"]',
      },
      {
        id: 'photo2',
        label: 'Right Photo',
        svgSelector: '[data-image="photo2"]',
      },
    ],
  },
  {
    id: 'meet-mentor',
    name: 'Meet the Mentor',
    description: 'Introduce team mentors',
    svgPath: '/templates/meet-mentor.svg',
    fields: [
      {
        id: 'mentorName',
        label: 'Mentor Name',
        placeholder: 'Name!',
        svgSelector: '[data-field="name"]',
      },
      {
        id: 'bio',
        label: 'Bio',
        placeholder: 'Enter mentor bio...',
        svgSelector: '[data-field="bio"]',
        multiline: true,
      },
    ],
    imageZones: [
      {
        id: 'mentorPhoto',
        label: 'Mentor Photo',
        svgSelector: '[data-image="mentor"]',
      },
    ],
  },
  {
    id: 'fun-fact',
    name: 'Fun Fact of the Week',
    description: 'Share interesting facts about the team',
    svgPath: '/templates/fun-fact.svg',
    fields: [
      {
        id: 'factText',
        label: 'Fun Fact',
        placeholder: 'Enter an interesting fact...',
        svgSelector: '[data-field="fact"]',
        multiline: true,
      },
    ],
    imageZones: [
      {
        id: 'factPhoto',
        label: 'Photo',
        svgSelector: '[data-image="photo"]',
      },
    ],
  },
  {
    id: 'crew-week',
    name: 'Crew of the Week',
    description: 'Feature team members',
    svgPath: '/templates/crew-week.svg',
    fields: [
      {
        id: 'crew1Name',
        label: 'Crew Member 1 Name',
        placeholder: 'Name...',
        svgSelector: '[data-field="crew1-name"]',
      },
      {
        id: 'crew1Info',
        label: 'Crew Member 1 Info',
        placeholder: 'Details...',
        svgSelector: '[data-field="crew1-info"]',
        multiline: true,
      },
      {
        id: 'crew2Name',
        label: 'Crew Member 2 Name',
        placeholder: 'Name...',
        svgSelector: '[data-field="crew2-name"]',
      },
      {
        id: 'crew2Info',
        label: 'Crew Member 2 Info',
        placeholder: 'Details...',
        svgSelector: '[data-field="crew2-info"]',
        multiline: true,
      },
    ],
    imageZones: [
      {
        id: 'crewPhoto1',
        label: 'Crew Photo 1',
        svgSelector: '[data-image="crew1"]',
      },
      {
        id: 'crewPhoto2',
        label: 'Crew Photo 2',
        svgSelector: '[data-image="crew2"]',
      },
    ],
  },
];
