const en = {
  menu: {
    assets: 'Assets',
    agents: 'Agents',
    operations: 'Operations',
    placeholder1: 'Placeholder 1',
    placeholder2: 'Placeholder 2',
    placeholder3: 'Placeholder 3',
  },
  asset: {
    noItemSelected: 'No item selected',
    fields: {
      id: 'ID',
      name: 'Name',
      latitude: 'Latitude',
      longitude: 'Longitude',
      altitude: 'Altitude',
      heading: 'Heading',
      speed: 'Speed',
      assetType: 'Asset Type',
      threatType: 'Threat Type',
      active: 'Active',
      firstUpdated: 'First Updated',
      lastUpdated: 'Last Updated',
      relatedAgentId: 'Related Agent ID',
      createdAt: 'Created At',
      updatedAt: 'Updated At',
    },
    assetTypes: {
      unknown: 'Unknown',
      person: 'Person',
      groupOfPeople: 'Group of People',
      aircraft: 'Aircraft',
      ship: 'Ship',
      submarine: 'Submarine',
      vehicle: 'Vehicle',
      building: 'Building',
      other: 'Other',
    },
    threatTypes: {
      unknown: 'Unknown',
      own: 'Own',
      friend: 'Friend',
      neutral: 'Neutral',
      hostile: 'Hostile',
    },
    active: {
      yes: 'Yes',
      no: 'No',
    },
  }
} as const;

export default en;
