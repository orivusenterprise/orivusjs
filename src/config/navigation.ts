import { NavItem } from '@/types/nav';

export const navigation: NavItem[] = [
    { name: 'Dashboard', href: '/', icon: 'Home' },
        { name: 'Instructor', href: '/instructors', icon: 'Folder' },
        { name: 'Course', href: '/courses', icon: 'Folder' },
        { name: 'Lesson', href: '/lessons', icon: 'Folder' },
        { name: 'Student', href: '/students', icon: 'Folder' },
    // ORIVUS_INJECTION_POINT
];
