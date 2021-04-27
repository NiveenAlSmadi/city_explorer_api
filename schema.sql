DROP TABLE IF EXISTS loco;

CREATE TABLE IF NOT EXISTS loco (
  search_query VARCHAR(255),
  formatted_query VARCHAR(255),
  latitude VARCHAR(255) ,
  longitude  VARCHAR(255)

);


-- DROP TABLE IF EXISTS locations;

-- CREATE TABLE locations (
--     id SERIAL PRIMARY KEY,
--     search_query VARCHAR(255),
--     formatted_query VARCHAR(255),
--     latitude NUMERIC(10, 7),
--     longitude NUMERIC(10, 7)
--   );