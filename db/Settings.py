from sqlite_base import *
from sqlalchemy import Column, Integer, String


class Settings(Base):
    __tablename__ = "settings"
    id = Column(Integer, primary_key=True)
    serverid = Column(Integer)
    loggerChanalid = Column(Integer)

    def __init__(self, serverid, loggerChanalid):
        self.serverid = serverid
        self.loggerChanalid = loggerChanalid


# 데이터베이스 생성
init_db()