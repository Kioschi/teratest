create table customers
(
    id       int auto_increment
        primary key,
    name     varchar(255)      not null,
    lastName varchar(255)      not null,
    tel      varchar(22)       not null,
    email    varchar(319)      not null,
    deleted  tinyint default 0 not null
);
