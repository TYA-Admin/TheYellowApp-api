CREATE TABLE users
(
    user_id     INT AUTO_INCREMENT PRIMARY KEY,
    uuid        VARCHAR(36)  NOT NULL UNIQUE,
    name        VARCHAR(255) NOT NULL,
    email       VARCHAR(255) NOT NULL UNIQUE,
    password    VARCHAR(255) NOT NULL,
    profile_pic VARCHAR(255),
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by  VARCHAR(255),
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updated_by  VARCHAR(255)
);

CREATE TABLE books
(
    book_id    INT AUTO_INCREMENT PRIMARY KEY,
    uuid       VARCHAR(36)  NOT NULL UNIQUE,
    name       VARCHAR(255) NOT NULL,
    author     VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updated_by VARCHAR(255),
    sequential BOOLEAN   DEFAULT FALSE
);

CREATE TABLE qrcodes
(
    qrcode_id    INT AUTO_INCREMENT PRIMARY KEY,
    uuid         VARCHAR(36) NOT NULL UNIQUE,
    title        VARCHAR(255),
    subtitle     VARCHAR(255),
    content_type ENUM('video', 'sticker', 'intermission') NOT NULL,
    book_id      INT,
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by   VARCHAR(255),
    updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updated_by   VARCHAR(255),
    sequential   BOOLEAN   DEFAULT FALSE,
    FOREIGN KEY (book_id) REFERENCES books (book_id)
);

CREATE TABLE comments
(
    comment_id        INT AUTO_INCREMENT PRIMARY KEY,
    uuid              VARCHAR(36) NOT NULL UNIQUE,
    book_id           INT,
    qrcode_id         INT,
    name              VARCHAR(255),
    description       TEXT,
    likes             INT       DEFAULT 0,
    parent_comment_id INT,
    sequence          INT,
    created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by        INT,
    updated_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updated_by        VARCHAR(255),
    value             TEXT,
    FOREIGN KEY (book_id) REFERENCES books (book_id),
    FOREIGN KEY (qrcode_id) REFERENCES qrcodes (qrcode_id),
    FOREIGN KEY (parent_comment_id) REFERENCES comments (comment_id),
    FOREIGN KEY (created_by) REFERENCES users (user_id)
);

CREATE TABLE open_books
(
    open_book_id INT AUTO_INCREMENT PRIMARY KEY,
    book_id      INT,
    user_id      INT,
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by   VARCHAR(255),
    updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updated_by   VARCHAR(255),
    device_id    VARCHAR(255),
    FOREIGN KEY (book_id) REFERENCES books (book_id),
    FOREIGN KEY (user_id) REFERENCES users (user_id)
);

CREATE TABLE videos
(
    video_id    INT AUTO_INCREMENT PRIMARY KEY,
    uuid        VARCHAR(36) NOT NULL UNIQUE,
    book_id     INT,
    name        VARCHAR(255),
    qrcode_id   INT,
    description TEXT,
    url         VARCHAR(255),
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by  VARCHAR(255),
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updated_by  VARCHAR(255),
    sequence    INT,
    FOREIGN KEY (book_id) REFERENCES books (book_id),
    FOREIGN KEY (qrcode_id) REFERENCES qrcodes (qrcode_id)
);

CREATE TABLE stickers
(
    sticker_id  INT AUTO_INCREMENT PRIMARY KEY,
    uuid        VARCHAR(36) NOT NULL UNIQUE,
    book_id     INT,
    name        VARCHAR(255),
    description TEXT,
    qrcode_id   INT,
    url         VARCHAR(255),
    sequence    INT,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by  VARCHAR(255),
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updated_by  VARCHAR(255),
    FOREIGN KEY (book_id) REFERENCES books (book_id),
    FOREIGN KEY (qrcode_id) REFERENCES qrcodes (qrcode_id)
);

CREATE TABLE open_qrcodes
(
    open_qrcode_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id        INT,
    qrcode_id      INT,
    created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by     VARCHAR(255),
    updated_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updated_by     VARCHAR(255),
    device_id      VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users (user_id),
    FOREIGN KEY (qrcode_id) REFERENCES qrcodes (qrcode_id)
);
