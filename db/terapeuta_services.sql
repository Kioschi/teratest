create table services
(
    id      int auto_increment
        primary key,
    userID  int                          not null,
    name    varchar(255)                 not null,
    price   decimal(5, 2)                not null,
    deleted tinyint    default 0         not null,
    time    int                          not null,
    color   varchar(7) default '#ffffff' null,
    constraint services_ibfk_1
        foreign key (userID) references users (id)
);

create index userID
    on services (userID);
