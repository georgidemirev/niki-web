export type Status =
    | 'waiting'
    | 'negotiating'
    | 'accepted'
    | 'declined'
    | 'paid'
    | '';
export type DateFormat =
    | 'yyyy-mm-dd'
    | 'dd mmm yyyy'
    | 'mmm dd yyyy'
    | 'dd.mm.yyyy';
export type TimeFormat = 'hh:mm';
export type SortType = 'followers' | 'eng_rate' | 'new';
export type FollowerAgeType =
    | '13-17'
    | '18-24'
    | '25-34'
    | '35-44'
    | '45-54'
    | '55-64'
    | '65+'
    | 'Any';
export type Country = 'bg' | 'es' | 'Any';
export type UserRole = 'manager' | 'influencer';
export type FileType =
    | 'application/json'
    | 'image/jpeg'
    | 'video/quicktime'
    | 'image/png'
    | 'video/mp4'
    | '';
