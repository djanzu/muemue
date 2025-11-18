mcp mysql


次の２つのテーブルのDDLを作成してください。
また、seeding用のSQLの作成もお願いします。
seeding用のデータは
users: 60件
login_histories: ランダムに偏りが出るように 200件

### users
id: int pk not null : 通し番号
name: varchar(100) not null: 名前
email: varchar(100) not null: メアド
birthdate: date: 誕生年月日


### login_histories
id: int pk not null : 通し番号
user_id: int fk: users.id
login_date: datetime: ログイン日時


