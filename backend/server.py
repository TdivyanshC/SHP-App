from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from bson import ObjectId

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app
app = FastAPI()
api_router = APIRouter(prefix="/api")

# Models
class User(BaseModel):
    name: str
    email: str
    xp: int = 0
    joined_at: datetime = Field(default_factory=datetime.utcnow)

class NewsArticle(BaseModel):
    title_en: str
    title_hi: str
    summary_en: str
    summary_hi: str
    content_en: str
    content_hi: str
    image_base64: str
    truth_score: float
    source: str
    fact_vs_claim_en: str = ""
    fact_vs_claim_hi: str = ""
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Poll(BaseModel):
    question_en: str
    question_hi: str
    yes: int = 0
    no: int = 0
    created_at: datetime = Field(default_factory=datetime.utcnow)

class VoteRequest(BaseModel):
    vote: str  # "yes" or "no"

class GameScore(BaseModel):
    user_email: Optional[str] = "guest@swadeshi.in"
    game_id: str
    score: int
    xp_earned: int
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Quote(BaseModel):
    quote_en: str
    quote_hi: str
    author_en: str = "Swadeshi Hind"
    author_hi: str = "स्वदेशी हिन्द"
    date: str

class VolunteerForm(BaseModel):
    name: str
    email: str
    phone: str
    state: str
    message: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

# Initialize sample data
@app.on_event("startup")
async def initialize_data():
    # Check if collections are empty and seed data
    if await db.news.count_documents({}) == 0:
        sample_news = [
            {
                "title_en": "India's GDP Growth Exceeds Expectations",
                "title_hi": "भारत की GDP वृद्धि अपेक्षाओं से अधिक",
                "summary_en": "India's economy shows robust growth with GDP increasing by 7.8% in the last quarter.",
                "summary_hi": "भारत की अर्थव्यवस्था मजबूत वृद्धि दिखाती है, पिछली तिमाही में GDP में 7.8% की वृद्धि हुई।",
                "content_en": "India's economic growth continues to outpace global expectations, driven by strong domestic consumption and government infrastructure spending. The GDP growth of 7.8% reflects the resilience of the Indian economy.",
                "content_hi": "भारत की आर्थिक वृद्धि वैश्विक अपेक्षाओं से आगे निकल रही है, जो मजबूत घरेलू खपत और सरकारी बुनियादी ढांचा खर्च द्वारा संचालित है। 7.8% की GDP वृद्धि भारतीय अर्थव्यवस्था की लचीलापन को दर्शाती है।",
                "image_base64": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1MCIgZmlsbD0iI0ZGOTkzMyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjI0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkVjb25vbXkgR3Jvd3RoPC90ZXh0Pjwvc3ZnPg==",
                "truth_score": 0.92,
                "source": "Ministry of Finance",
                "fact_vs_claim_en": "Fact: GDP grew by 7.8%. This is verified by official government data.",
                "fact_vs_claim_hi": "तथ्य: GDP में 7.8% की वृद्धि हुई। यह आधिकारिक सरकारी डेटा द्वारा सत्यापित है।",
                "created_at": datetime.utcnow()
            },
            {
                "title_en": "Digital India Initiative Reaches 1 Billion Users",
                "title_hi": "डिजिटल इंडिया पहल 1 अरब उपयोगकर्ताओं तक पहुंची",
                "summary_en": "The Digital India program has successfully connected over 1 billion citizens to digital services.",
                "summary_hi": "डिजिटल इंडिया कार्यक्रम ने सफलतापूर्वक 1 अरब से अधिक नागरिकों को डिजिटल सेवाओं से जोड़ा है।",
                "content_en": "The Digital India initiative has achieved a major milestone by connecting over 1 billion users to various digital platforms and services, making India one of the most digitally connected nations.",
                "content_hi": "डिजिटल इंडिया पहल ने विभिन्न डिजिटल प्लेटफार्मों और सेवाओं से 1 अरब से अधिक उपयोगकर्ताओं को जोड़कर एक प्रमुख मील का पत्थर हासिल किया है, जिससे भारत सबसे अधिक डिजिटल रूप से जुड़े देशों में से एक बन गया है।",
                "image_base64": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1MCIgZmlsbD0iIzEzODgwOCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjI0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkRpZ2l0YWwgSW5kaWE8L3RleHQ+PC9zdmc+",
                "truth_score": 0.88,
                "source": "Ministry of Electronics and IT",
                "fact_vs_claim_en": "Fact: Over 1 billion digital transactions recorded. Verified by MEITY reports.",
                "fact_vs_claim_hi": "तथ्य: 1 अरब से अधिक डिजिटल लेनदेन दर्ज किए गए। MEITY रिपोर्ट द्वारा सत्यापित।",
                "created_at": datetime.utcnow()
            }
        ]
        await db.news.insert_many(sample_news)
    
    if await db.polls.count_documents({}) == 0:
        sample_polls = [
            {
                "question_en": "Should India invest more in renewable energy?",
                "question_hi": "क्या भारत को अक्षय ऊर्जा में अधिक निवेश करना चाहिए?",
                "yes": 0,
                "no": 0,
                "created_at": datetime.utcnow()
            }
        ]
        await db.polls.insert_many(sample_polls)
    
    if await db.quotes.count_documents({}) == 0:
        sample_quotes = [
            {
                "quote_en": "A nation's culture resides in the hearts and souls of its people.",
                "quote_hi": "एक राष्ट्र की संस्कृति उसके लोगों के दिलों और आत्माओं में निवास करती है।",
                "author_en": "Mahatma Gandhi",
                "author_hi": "महात्मा गांधी",
                "date": datetime.utcnow().strftime("%Y-%m-%d")
            }
        ]
        await db.quotes.insert_many(sample_quotes)

# API Routes
@api_router.get("/")
async def root():
    return {"message": "Swadeshi Hind API", "version": "1.0"}

@api_router.get("/news")
async def get_news():
    news = await db.news.find().sort("created_at", -1).to_list(100)
    for article in news:
        article["_id"] = str(article["_id"])
    return {"news": news}

@api_router.get("/polls")
async def get_polls():
    polls = await db.polls.find().to_list(100)
    for poll in polls:
        poll["_id"] = str(poll["_id"])
    return {"polls": polls}

@api_router.post("/polls/{poll_id}/vote")
async def vote_poll(poll_id: str, vote_request: VoteRequest):
    try:
        result = await db.polls.update_one(
            {"_id": ObjectId(poll_id)},
            {"$inc": {vote_request.vote: 1}}
        )
        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail="Poll not found")
        
        poll = await db.polls.find_one({"_id": ObjectId(poll_id)})
        poll["_id"] = str(poll["_id"])
        return {"success": True, "poll": poll}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/games/score")
async def submit_game_score(score: GameScore):
    score_dict = score.dict()
    result = await db.game_scores.insert_one(score_dict)
    return {"success": True, "id": str(result.inserted_id), "xp_earned": score.xp_earned}

@api_router.get("/quotes/today")
async def get_today_quote():
    quote = await db.quotes.find_one()
    if quote:
        quote["_id"] = str(quote["_id"])
        return quote
    return {"quote_en": "Swadeshi Soch. Swadeshi Rashtra.", "quote_hi": "स्वदेशी सोच। स्वदेशी राष्ट्र।", "author_en": "Swadeshi Hind", "author_hi": "स्वदेशी हिन्द"}

@api_router.post("/volunteer")
async def submit_volunteer_form(form: VolunteerForm):
    form_dict = form.dict()
    result = await db.volunteers.insert_one(form_dict)
    return {"success": True, "message": "Thank you for volunteering!", "id": str(result.inserted_id)}

# Include router
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()