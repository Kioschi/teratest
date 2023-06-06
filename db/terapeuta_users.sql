create table users
(
    id         int auto_increment
        primary key,
    login      varchar(255)      not null,
    password   varchar(255)      not null,
    name       varchar(255)      null,
    lastName   varchar(255)      null,
    admin      tinyint default 0 not null,
    deleted    tinyint default 0 not null,
    shiftStart time              null,
    shiftEnd   time              null,
    dayStart   tinyint           null,
    dayEnd     tinyint           null
);