class User:
    # Constructor method (initializer)
    def __init__(self, user_id, user_name, password, name, email, gender, bio, image, dob):
        self.user_id = user_id
        self.user_name = user_name
        self.password = password
        self.name = name
        self.email = email
        self.gender = gender
        self.bio = bio
        self.image = image
        self.dob = dob

    @classmethod
    def from_db_row(cls, row):
        return cls(
            user_id=row[0],
            user_name=row[1],
            password=None,
            name=row[2],
            email=row[3],
            gender=row[4],
            bio=row[5],
            image=row[6],
            dob=row[7],
        )
    
    def to_dict(self):
        return {
            'user_id': self.user_id,
            'user_name': self.user_name,
            'name': self.name,
            'email': self.email,
            'gender': self.gender,
            'bio': self.bio,
            'image': self.image,
            'dob': self.dob,
        }

    def display_info(self):
        print(f"Name: {self.name}, Age: {self.dob}")

    def greet(self, other_person):
        print(f"Hello, {other_person.name}! My name is {self.name}.")

