
export const RoutesName = {
    Login: '/',
    
    Dashboard: '/dashboard',

    Homes: '/homes',
    HomeAdd: '/homes/add',
    HomeEdit: '/homes/edit',

    Pages: '/pages',
    PageAdd: '/pages/add',
    PageEdit: '/pages/edit',

    Services: '/services',
    ServiceAdd: '/services/add',
    ServiceEdit: '/services/edit',

    Properties: '/properties',
    PropertyAdd: '/properties/add',
    PropertyEdit: '/properties/edit',

    Users: '/users',
    UserAdd: '/users/add',
    UserEdit: '/users/edit',

    Categories: '/categories',
    CategoryAdd: '/categories/add',
    CategoryEdit: '/categories/edit',

    Events: '/events',
    EventAdd: '/events/add',
    EventEdit: '/events/edit',

    Tags: '/tags',
    TagAdd: '/tags/add',
    TagEdit: '/tags/edit',

    Rooms: '/rooms',
    RoomAdd: '/rooms/add',
    RoomEdit: '/rooms/edit',

    Abouts: '/abouts',
    AboutAdd: '/abouts/add',
    AboutEdit: '/abouts/edit',

    Experiences: '/experiences',
    ExperienceAdd: '/experiences/add',
    ExperienceEdit: '/experiences/edit',


}

export const AvailableRoutes = Object.values(RoutesName);

//--------------------funtion to convert valid route name

export const ConvertIntoValidRoute = (path: string)=>{
    return path?.toLocaleLowerCase()?.split(" ")?.join("-")
}

//firebase collection names

export const firebaseCollectionName = {
    ClientReviews: 'client_reviews',
    Devronins: 'devronins',
    Services: 'services',
    TeamMembers: 'team_members',
    Technologies: 'technologies',
    Projects: 'projects'
}
