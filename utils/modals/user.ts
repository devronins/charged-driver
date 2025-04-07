export interface UserModal {
    id: string;
    email: string;
    name: string;
    image: ImageModal;
    role: 1 | 2;
    status : 'active' | 'hidden';
    password: string;
    createdAt: Date;
    updatedAt: Date;
  }

 interface ImageModal {
  name: string,
  imageUrl: string,
  type: string,
  size: number
 }

  export const UserType = {
    'Admin': 1,
    'User': 2
  }

  export const AvailableUserTypes = [
    {title: 'Admin', value: '1'},
    {title: 'User', value: '2'}
  ]

  export const UserStatus = {
    ACTIVE: "active",
    HIDDEN: "hidden"
  }

  export const AvailableUserStatus = [
    { title: 'Active', value: 'active' },
    { title: 'Hidden', value: 'hidden' }
  ]