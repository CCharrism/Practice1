import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Messages } from './messages/messages';
import { Lists } from './lists/lists';
import { MemberList } from './members/member-list/member-list';
import { MemberDetail } from './members/member-detail/member-detail';
import { MessageThread } from './message-thread/message-thread';
import { authGuard } from './_guards/authguard';
import { preventUnsavedChangesGuard } from './_guards/prevent-unsaved-changes.guard';
import { NotFound } from './not-found/not-found';
import { EditMember } from './members/edit-member/edit-member';

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
                path: 'messages/:username', component: MessageThread,
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
                path: 'members/:username', component: MemberDetail,
                canActivate: [authGuard]

            },
             {
                path: 'member/edit', component: EditMember,
                canActivate: [authGuard],
                canDeactivate: [preventUnsavedChangesGuard]
            }


        ]
    }    ,
    {
        path: '**', component: NotFound
    }
];
