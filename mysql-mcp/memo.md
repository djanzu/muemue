
# MySQLをMCPサーバー経由で使用する

## 対象DB
- dockerを使ってローカルに3308で露出。
- docker compose up
  - 自動的に初期データ投入されます

### files
- compose.yml
- init.sql
  - 初期データ


## mariadb公式のMCP

https://github.com/MariaDB/mcp

使い方

1. cloneする
2. cloneしたディレクトリで 
  - ``uv lock``
  - ``uv sync``
  を実行。
3. cloneしたディレクトリに.envを作成し、以下を記載
```
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_PORT=3306
DB_NAME=your_default_database

MCP_READ_ONLY=true
MCP_MAX_POOL_SIZE=10

# embeddingを使用する場合
# EMBEDDING_PROVIDER=openai
# OPENAI_API_KEY=sk-...
# GEMINI_API_KEY=AI...
# HF_MODEL="BAAI/bge-m3"
```

4. mcpクライアントに以下を追加
```
{
  "mcpServers": {
    "MariaDB_Server": {
      "command": "uv",
      "args": [
        "--directory",
        "path/to/mariadb-mcp-server/",
        "run",
        "server.py"
        ],
        "envFile": "path/to/mcp-server-mariadb-vector/.env"      
    }
  }
}
```
実際に追加するのは以下。
```
    "MariaDB_Server": {
      "command": "uv",
      "args": [
        "run",
        "--directory",
        "/Users/anzu/kaisha/pxt/mysql-mcp/mcp/src",
        "server.py"
        ],
        "envFile": "/Users/anzu/kaisha/pxt/mysql-mcp/mcp/.env"      
    }
```

5. 実行
``uv run server.py``
たぶんこれはmcpクライアントから自動的に呼ばれるはずなので、ここでは明示的に実行はしない。  
その代わりに以下のコマンドでmcpサーバーが正しく動いていることを確認する。  

```
npx @modelcontextprotocol/inspector uv run --directory /Users/anzu/kaisha/pxt/mysql-mcp/mcp/src server.py
```



## another mcp
こちらもググるとみんなが使っているけど、本当に安全なのかわからないので今回は取り扱わない。

https://github.com/benborla/mcp-server-mysql


