import import_package
from database import db, WordResult
from user import UserRecord

class WordResultRecord:
  @staticmethod
  def get(user_id, word_id):
    wordresult = db.session.query(WordResult)\
      .filter(WordResult.user_id == user_id,\
       WordResult.word_id == word_id).first()
    return wordresult

  @staticmethod
  def get_wordresult_not_learn(user_id):
    word_results = db.session.query(WordResult)\
      .filter(WordResult.user_id == user_id,\
      WordResult.is_learned == False).first()
    return word_results

  @staticmethod
  def create_wordresult(user_id, word_id):
    wordresult = WordResult(word_id=word_id)
    user = UserRecord.get(user_id)
    user.word_results.append(wordresult)
    db.session.add(user)
    db.session.commit()
    return wordresult
