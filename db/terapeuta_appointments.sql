create table appointments
(
    id              int auto_increment
        primary key,
    customerID      int               not null,
    userID          int               not null,
    serviceID       int               not null,
    hour            time              not null,
    date            date              not null,
    refID           int               null,
    deleted         tinyint default 0 not null,
    byWhoID         int               not null,
    lastChangedDate datetime          not null,
    info            text              null,
    multiplier      int               null,
    recurringID     varchar(6)        null,
    constraint appointments_ibfk_1
        foreign key (customerID) references customers (id),
    constraint appointments_ibfk_2
        foreign key (userID) references users (id),
    constraint appointments_ibfk_3
        foreign key (serviceID) references services (id),
    constraint appointments_ibfk_4
        foreign key (byWhoID) references users (id),
    constraint appointments_ibfk_5
        foreign key (multiplier) references options (id)
);

create index byWhoID
    on appointments (byWhoID);

create index customerID
    on appointments (customerID);

create index multiplier
    on appointments (multiplier);

create index serviceID
    on appointments (serviceID);

create index userID
    on appointments (userID);
