CREATE TABLE authors (
    author_id serial PRIMARY KEY,
    name character varying NOT NULL UNIQUE,
    birthday date,
    deathday date
);

CREATE TABLE drawings (
    drawing_id varchar PRIMARY KEY,
    created date,
    author_id integer REFERENCES authors(author_id),
    picture bytea NOT NULL
);


CREATE TABLE tags (
    tag_id serial PRIMARY KEY,
    name varchar NOT NULL UNIQUE
);

CREATE TABLE tagmap (
		drawing_id varchar REFERENCES drawings(drawing_id),
		tag_id integer REFERENCES tags(tag_id)
)
