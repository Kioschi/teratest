create table options
(
    id         int auto_increment
        primary key,
    name       varchar(255)                 not null,
    multiplier decimal(3, 2)                not null,
    deleted    tinyint    default 0         null,
    color      varchar(7) default '#ffffff' not null
);
