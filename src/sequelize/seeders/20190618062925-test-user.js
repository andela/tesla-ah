import superUserPsw from '../../helpers/hashSuperUserPsw';

module.exports = {
  up: queryInterface => queryInterface.bulkInsert(
    'Users',
    [
      {
        firstName: 'Mireille',
        lastName: 'Niwemuhuza',
        username: 'mifeille',
        email: 'nimilleer@gmail.com',
        password: 'Mireille1!',
        bio: '',
        image: '',
        dateOfBirth: '12/12/2000',
        gender: '',
        provider: '',
        socialId: '',
        verified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        isAdmin: false
      },
      {
        firstName: 'SuperUser',
        lastName: 'SuperUser',
        username: 'superUser',
        email: 'superuser@gmail.com',
        password: superUserPsw,
        bio: '',
        image: '',
        dateOfBirth: '12/12/2000',
        gender: '',
        provider: '',
        socialId: '',
        verified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        isAdmin: true
      },
      {
        firstName: 'eric',
        lastName: 'rukundo',
        username: 'ericrundo',
        email: 'hhhhhhhhhhhhhh3h3hh3@gmail.com',
        password: 'eric123',
        bio: 'nan',
        image: 'nan',
        dateOfBirth: new Date(),
        gender: 'male',
        provider: 'nan',
        socialId: '3434343',
        verified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        isAdmin: false
      },
      {
        firstName: 'Uhiriwe',
        lastName: 'Audace',
        username: 'Audace',
        email: 'u.audace@gmail.com',
        password: 'Uhiriwe1!',
        bio: '',
        image: '',
        dateOfBirth: '12/12/1999',
        gender: '',
        provider: '',
        socialId: '',
        verified: 'true',
        createdAt: new Date(),
        updatedAt: new Date(),
        isAdmin: false
      },
      {
        firstName: 'Eric',
        lastName: 'Prestein',
        username: 'ericprestein',
        email: 'ericrukundo005@gmail.com',
        password: 'ericprestein',
        bio: 'nan',
        image: 'nan',
        dateOfBirth: new Date(),
        gender: 'male',
        provider: 'nan',
        socialId: '3434343',
        verified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        isAdmin: false
      },
      {
        firstName: 'Eric',
        lastName: 'Prestein',
        username: 'ericprestein',
        email: 'gprestein055@gmail.com',
        password:
            '$2b$08$aKninSz.39G5SxBE5QOro.xBJXIEtnXkrOBriWfVCpqND8AzeJMaC',
        bio: 'nan',
        image: 'nan',
        dateOfBirth: new Date(),
        gender: 'male',
        provider: 'nan',
        socialId: '3434343',
        verified: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        firstName: 'Eric',
        lastName: 'Prestein',
        username: 'ericprestein',
        email: 'ericprestein005@gmail.com',
        password:
            '$2b$08$aKninSz.39G5SxBE5QOro.xBJXIEtnXkrOBriWfVCpqND8AzeJMaC',
        bio: 'nan',
        image: 'nan',
        dateOfBirth: new Date(),
        gender: 'male',
        provider: 'nan',
        socialId: '3434343',
        verified: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ],
    {}
  )
};
