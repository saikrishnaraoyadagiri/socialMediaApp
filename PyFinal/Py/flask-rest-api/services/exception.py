import json

class CustomException(Exception):
    def __init__(self, message, status_code):
        super().__init__(message)
        self.status_code = status_code

    def to_json(self):
        return json.dumps({
            "error": str(self),
            "status_code": self.status_code
        })

def process_data(data):
    if not isinstance(data, list):
        raise CustomException("Data must be a list", 400)

try:
    process_data("not a list")
except CustomException as e:
    print(f"Custom error: {e}, Status Code: {e.status_code}")
    json_data = e.to_json()
    print(f"JSON representation: {json_data}")
