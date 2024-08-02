
class Follow:
    def __init__(self, follower_id, followed_id, created_ts,status):
        self.follower_id = follower_id
        self.followed_id = followed_id
        self.created_ts = created_ts
        self.status = status #0-unfollowed, 1-requested,2=followed,4-declined

    @classmethod
    def from_db_row(cls, row):
        return cls(
            follower_id=row[0],
            followed_id=row[1],
            created_ts = row[2],
            status = row[3]
        )
