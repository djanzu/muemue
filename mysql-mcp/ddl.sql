-- users テーブル
CREATE TABLE users (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    birthdate DATE
);

-- login_histories テーブル
CREATE TABLE login_histories (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED NOT NULL,
    -- DATETIME型を使用し、デフォルト値として現在時刻を設定
    login_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    
);
