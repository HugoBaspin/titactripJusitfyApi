INSERT INTO users
    (email, words)
VALUES
    ('user0@gmail.com', 90000);

INSERT INTO users
    (email, words, checked)
VALUES
    ('user1@gmail.com', 90000, now() - INTERVAL
'1 DAY');
