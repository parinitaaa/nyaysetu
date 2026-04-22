from pydantic import BaseModel


class LawyerSearch(BaseModel):
    city: str = "bangalore"
    category: str = "criminal"