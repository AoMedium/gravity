export const systems = {
  systems: [
    {
      name: 'Basic System',
      center: 'Star',
      AU: 5000,

      systemObjects: [
        {
          name: 'Star',
          mass: 1000,
          position: {
            x: 0,
            y: 0,
          },
        },
        {
          name: 'Planet 1',
          mass: 10,
          position: {
            x: 100,
            y: 0,
          },
          velocity: {
            x: 0,
            y: -0.2,
          },
        },
      ],
    },
    {
      name: 'Sol Alpha',
      center: 'Sol Alpha',
      AU: 5000,

      systemObjects: [
        {
          name: 'Sol Alpha',
          mass: 59600000,
          position: {
            x: 0,
            y: 0,
          },
          attributes: {
            fixed: true,
            primaryColor: '#fff',
          },
        },
        {
          name: 'Kas',
          mass: 55,
          attributes: {
            orbit: true,
            distance: 0.387,
            primaryColor: '#aaa',
          },
        },
        {
          name: 'Ayca',
          mass: 815,
          attributes: {
            orbit: true,
            distance: 0.723,
            primaryColor: '#ff9d00',
          },
        },
        {
          name: 'Terra',
          mass: 1000,
          attributes: {
            orbit: true,
            distance: 1,
            primaryColor: '#00aeff',
          },
        },
        {
          name: 'Muna',
          mass: 12,
          attributes: {
            orbit: true,
            center: 'Terra',
            distance: 0.002569,
          },
        },
      ],
    },
  ],
};
