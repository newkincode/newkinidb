from Settings import Settings
from sqlite_base import db_session
from sqlalchemy import select
import json
import sys

# user 테이블에 데이터 추가
def addSetting(serverid, loggerChanalid):
    settings = Settings(serverid, loggerChanalid)
    db_session.add(settings)
    db_session.commit()

def getSetting(serverid):
    # 특정 serverid를 가진 Settings 객체 조회 (첫 번째 객체만 반환)
    stmt = select(Settings).where(Settings.serverid == serverid)
    result = db_session.execute(stmt).scalars().first()  # 첫 번째 객체 반환 (없으면 None)

    if result:
        return json.dumps({
            "serverid": result.serverid,
            "loggerChanalid": result.loggerChanalid
        })
    return json.dumps({"error": "Setting not found."})

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Usage: python file.py <command> [<args>]")
        sys.exit(1)

    command = sys.argv[1]

    if command == "read" and len(sys.argv) == 3:
        server_id = sys.argv[2]
        print(getSetting(server_id))

    elif command == "write" and len(sys.argv) == 4:
        server_id = sys.argv[2]
        logger_channel_id = sys.argv[3]
        addSetting(server_id, logger_channel_id)
        print("200")
    
    else:
        print("500")
