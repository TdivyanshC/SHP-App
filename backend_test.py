#!/usr/bin/env python3
"""
Backend API Testing for Swadeshi Hind Party Mobile App
Tests all API endpoints for functionality and data structure validation
"""

import requests
import json
from datetime import datetime
import sys

# Backend URL from the review request
BASE_URL = "https://91f54322-bf92-4cac-ab40-09d3552ab5b7.preview.emergentagent.com/api"

class BackendTester:
    def __init__(self):
        self.base_url = BASE_URL
        self.test_results = []
        self.poll_id = None  # Will be set after getting polls
        
    def log_result(self, test_name, success, message, response_data=None):
        """Log test results"""
        result = {
            "test": test_name,
            "success": success,
            "message": message,
            "timestamp": datetime.now().isoformat()
        }
        if response_data:
            result["response_data"] = response_data
        self.test_results.append(result)
        
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}: {message}")
        
    def test_root_endpoint(self):
        """Test GET /api/ - root endpoint check"""
        try:
            response = requests.get(f"{self.base_url}/", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if "message" in data and "version" in data:
                    self.log_result("Root Endpoint", True, f"Status: {response.status_code}, Response: {data}")
                else:
                    self.log_result("Root Endpoint", False, f"Missing expected fields in response: {data}")
            else:
                self.log_result("Root Endpoint", False, f"Status: {response.status_code}, Response: {response.text}")
                
        except Exception as e:
            self.log_result("Root Endpoint", False, f"Exception: {str(e)}")
    
    def test_news_endpoint(self):
        """Test GET /api/news - should return list of news articles with truth scores"""
        try:
            response = requests.get(f"{self.base_url}/news", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                
                # Check if response has news array
                if "news" not in data:
                    self.log_result("News Endpoint", False, "Response missing 'news' field")
                    return
                
                news_articles = data["news"]
                if not isinstance(news_articles, list):
                    self.log_result("News Endpoint", False, "News field is not a list")
                    return
                
                if len(news_articles) == 0:
                    self.log_result("News Endpoint", False, "No news articles found")
                    return
                
                # Validate first article structure
                article = news_articles[0]
                required_fields = ["title_en", "title_hi", "summary_en", "summary_hi", "image_base64", "truth_score", "source"]
                missing_fields = [field for field in required_fields if field not in article]
                
                if missing_fields:
                    self.log_result("News Endpoint", False, f"Missing required fields: {missing_fields}")
                else:
                    # Check truth_score is numeric
                    if not isinstance(article["truth_score"], (int, float)):
                        self.log_result("News Endpoint", False, f"Truth score is not numeric: {article['truth_score']}")
                    else:
                        self.log_result("News Endpoint", True, f"Status: {response.status_code}, Found {len(news_articles)} articles with proper structure")
            else:
                self.log_result("News Endpoint", False, f"Status: {response.status_code}, Response: {response.text}")
                
        except Exception as e:
            self.log_result("News Endpoint", False, f"Exception: {str(e)}")
    
    def test_polls_endpoint(self):
        """Test GET /api/polls - should return list of polls"""
        try:
            response = requests.get(f"{self.base_url}/polls", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                
                # Check if response has polls array
                if "polls" not in data:
                    self.log_result("Polls Endpoint", False, "Response missing 'polls' field")
                    return
                
                polls = data["polls"]
                if not isinstance(polls, list):
                    self.log_result("Polls Endpoint", False, "Polls field is not a list")
                    return
                
                if len(polls) == 0:
                    self.log_result("Polls Endpoint", False, "No polls found")
                    return
                
                # Validate first poll structure and store poll_id for voting test
                poll = polls[0]
                required_fields = ["question_en", "question_hi", "yes", "no"]
                missing_fields = [field for field in required_fields if field not in poll]
                
                if missing_fields:
                    self.log_result("Polls Endpoint", False, f"Missing required fields: {missing_fields}")
                else:
                    # Store poll_id for voting test
                    if "_id" in poll:
                        self.poll_id = poll["_id"]
                    
                    # Check yes/no counts are numeric
                    if not isinstance(poll["yes"], int) or not isinstance(poll["no"], int):
                        self.log_result("Polls Endpoint", False, f"Yes/No counts are not integers: yes={poll['yes']}, no={poll['no']}")
                    else:
                        self.log_result("Polls Endpoint", True, f"Status: {response.status_code}, Found {len(polls)} polls with proper structure")
            else:
                self.log_result("Polls Endpoint", False, f"Status: {response.status_code}, Response: {response.text}")
                
        except Exception as e:
            self.log_result("Polls Endpoint", False, f"Exception: {str(e)}")
    
    def test_poll_voting(self):
        """Test POST /api/polls/{poll_id}/vote - test voting on a poll"""
        if not self.poll_id:
            self.log_result("Poll Voting", False, "No poll_id available from polls endpoint")
            return
            
        try:
            # Test voting "yes"
            vote_data = {"vote": "yes"}
            response = requests.post(f"{self.base_url}/polls/{self.poll_id}/vote", 
                                   json=vote_data, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                
                # Check response structure
                if "success" not in data or "poll" not in data:
                    self.log_result("Poll Voting", False, f"Missing expected fields in response: {data}")
                    return
                
                if not data["success"]:
                    self.log_result("Poll Voting", False, f"Vote was not successful: {data}")
                    return
                
                # Validate updated poll structure
                poll = data["poll"]
                if "yes" not in poll or "no" not in poll:
                    self.log_result("Poll Voting", False, f"Updated poll missing yes/no counts: {poll}")
                else:
                    self.log_result("Poll Voting", True, f"Status: {response.status_code}, Vote successful, updated counts: yes={poll['yes']}, no={poll['no']}")
            else:
                self.log_result("Poll Voting", False, f"Status: {response.status_code}, Response: {response.text}")
                
        except Exception as e:
            self.log_result("Poll Voting", False, f"Exception: {str(e)}")
    
    def test_quotes_endpoint(self):
        """Test GET /api/quotes/today - should return today's quote in English and Hindi"""
        try:
            response = requests.get(f"{self.base_url}/quotes/today", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                
                # Check required bilingual fields
                required_fields = ["quote_en", "quote_hi", "author_en", "author_hi"]
                missing_fields = [field for field in required_fields if field not in data]
                
                if missing_fields:
                    self.log_result("Quotes Endpoint", False, f"Missing required fields: {missing_fields}")
                else:
                    # Check that content is not empty
                    empty_fields = [field for field in required_fields if not data[field].strip()]
                    if empty_fields:
                        self.log_result("Quotes Endpoint", False, f"Empty content in fields: {empty_fields}")
                    else:
                        self.log_result("Quotes Endpoint", True, f"Status: {response.status_code}, Quote retrieved with bilingual content")
            else:
                self.log_result("Quotes Endpoint", False, f"Status: {response.status_code}, Response: {response.text}")
                
        except Exception as e:
            self.log_result("Quotes Endpoint", False, f"Exception: {str(e)}")
    
    def test_volunteer_endpoint(self):
        """Test POST /api/volunteer - test submitting volunteer form"""
        try:
            # Test data with realistic Indian information
            volunteer_data = {
                "name": "Rajesh Kumar",
                "email": "rajesh.kumar@gmail.com",
                "phone": "+91-9876543210",
                "state": "Maharashtra",
                "message": "I want to contribute to the Swadeshi movement and help build a stronger India."
            }
            
            response = requests.post(f"{self.base_url}/volunteer", 
                                   json=volunteer_data, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                
                # Check response structure
                required_fields = ["success", "message"]
                missing_fields = [field for field in required_fields if field not in data]
                
                if missing_fields:
                    self.log_result("Volunteer Endpoint", False, f"Missing required fields: {missing_fields}")
                elif not data["success"]:
                    self.log_result("Volunteer Endpoint", False, f"Volunteer submission was not successful: {data}")
                else:
                    self.log_result("Volunteer Endpoint", True, f"Status: {response.status_code}, Volunteer form submitted successfully")
            else:
                self.log_result("Volunteer Endpoint", False, f"Status: {response.status_code}, Response: {response.text}")
                
        except Exception as e:
            self.log_result("Volunteer Endpoint", False, f"Exception: {str(e)}")
    
    def test_games_score_endpoint(self):
        """Test POST /api/games/score - test submitting game score"""
        try:
            # Test data for game score submission
            score_data = {
                "user_email": "gamer@swadeshi.in",
                "game_id": "patriot_quiz_v1",
                "score": 850,
                "xp_earned": 100
            }
            
            response = requests.post(f"{self.base_url}/games/score", 
                                   json=score_data, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                
                # Check response structure
                required_fields = ["success", "xp_earned"]
                missing_fields = [field for field in required_fields if field not in data]
                
                if missing_fields:
                    self.log_result("Games Score Endpoint", False, f"Missing required fields: {missing_fields}")
                elif not data["success"]:
                    self.log_result("Games Score Endpoint", False, f"Score submission was not successful: {data}")
                else:
                    self.log_result("Games Score Endpoint", True, f"Status: {response.status_code}, Game score submitted successfully, XP earned: {data['xp_earned']}")
            else:
                self.log_result("Games Score Endpoint", False, f"Status: {response.status_code}, Response: {response.text}")
                
        except Exception as e:
            self.log_result("Games Score Endpoint", False, f"Exception: {str(e)}")
    
    def run_all_tests(self):
        """Run all backend API tests"""
        print(f"🚀 Starting Backend API Tests for Swadeshi Hind Party App")
        print(f"📡 Testing against: {self.base_url}")
        print("=" * 80)
        
        # Run tests in logical order
        self.test_root_endpoint()
        self.test_news_endpoint()
        self.test_polls_endpoint()
        self.test_poll_voting()  # Depends on polls endpoint
        self.test_quotes_endpoint()
        self.test_volunteer_endpoint()
        self.test_games_score_endpoint()
        
        # Summary
        print("\n" + "=" * 80)
        print("📊 TEST SUMMARY")
        print("=" * 80)
        
        total_tests = len(self.test_results)
        passed_tests = sum(1 for result in self.test_results if result["success"])
        failed_tests = total_tests - passed_tests
        
        print(f"Total Tests: {total_tests}")
        print(f"✅ Passed: {passed_tests}")
        print(f"❌ Failed: {failed_tests}")
        print(f"Success Rate: {(passed_tests/total_tests)*100:.1f}%")
        
        if failed_tests > 0:
            print("\n🔍 FAILED TESTS:")
            for result in self.test_results:
                if not result["success"]:
                    print(f"  • {result['test']}: {result['message']}")
        
        return passed_tests == total_tests

if __name__ == "__main__":
    tester = BackendTester()
    success = tester.run_all_tests()
    
    # Exit with appropriate code
    sys.exit(0 if success else 1)