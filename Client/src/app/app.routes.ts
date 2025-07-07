import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Messages } from './messages/messages';
import { Lists } from './lists/lists';
import { MemberList } from './members/member-list/member-list';
import { MemberDetail } from './members/member-detail/member-detail';
import { authGuard } from './_guards/authguard';
import { NotFound } from './not-found/not-found';

export const routes: Routes = [
    { path: '', component: Home },
    {
        path: '',
        runGuardsAndResolvers: 'always', // This ensures that the guard runs on every navigation
        canActivate: [authGuard], // This applies the authGuard to the root path  
        children: [
            {
                path: 'messages', component: Messages,
                canActivate: [authGuard]
            },
            {
                path: 'lists', component: Lists,
                canActivate: [authGuard]

            },
            {
                path: 'members', component: MemberList,
                canActivate: [authGuard]

            },
            {
                path: 'members/:id', component: MemberDetail,
                canActivate: [authGuard]

            }


        ]
    }    ,
    {
        path: '**', component: NotFound
    }
];
