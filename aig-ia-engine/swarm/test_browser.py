import time

from services.browser import BrowserService


def test_browser():
    print("Testing Secure Browser Service...")
    service = BrowserService()

    url = "https://example.com"
    print(f"Navigating to {url}...")

    result = service.navigate_and_extract(url)

    if result["status"] == "success":
        print("\n[SUCCESS]")
        print(f"Title: {result['title']}")
        print(f"Content Length: {len(result['content'])}")
        print(f"Snippet: {result['content'][:200]}...")
    else:
        print("\n[FAILED]")
        print(f"Error: {result.get('error')}")

if __name__ == "__main__":
    test_browser()
if __name__ == "__main__":
    test_browser()
