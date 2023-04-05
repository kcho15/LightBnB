INSERT INTO users (name, email, password)
VALUES ('Mr. X.', 'mrx@x.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.' ),
('Agent H.', 'agentH@h.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.' ),
('Dr. Milo', 'docmilo@doctor.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.' ); 

INSERT INTO properties (title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code, active)
VALUES ('Battlefield', 'description', 'thumbnail', 'cover', 150, 2, 1, 1, 'Canada', '123 Fake Street', 'Vancouver', 'BC', 'V6E 1N1', TRUE),
('PS 2', 'description', 'thumbnail', 'cover', 200, 1, 2, 3, 'Canada', '456 Fake Bvld', 'Burnaby', 'BC', 'V6G 9N9', TRUE),
('Town n City',  'description', 'thumbnail', 'cover', 300, 3, 4, 5, 'Canada', '789 Fake Avenue', 'West Vancouver', 'BC', 'V7G 1N3', TRUE);   

INSERT INTO reservations (start_date, end_date, property_id, guest_id)
VALUES ('2018-09-11', '2018-09-26', 1, 1),
('2019-01-04', '2019-02-01', 2, 2),
('2021-10-01', '2021-10-14', 3, 3);

INSERT INTO property_reviews (rating, message)
VALUES (3, 'messages'), (4, 'messages'), (5, 'messages') 
