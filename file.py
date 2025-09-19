import requests

def fetch_localization_file(base_url, language, namespace, cache_buster):
    res_get_path_template = '/locales/__lng__/__ns__.json?_=' + str(cache_buster)

    url_path = res_get_path_template.replace('__lng__', language).replace('__ns__', namespace)

    full_url = base_url + url_path
    
    print(f"Attempting to request URL: {full_url}\n")

    try:
        # Make the GET request
        response = requests.get(full_url)
        
        # Raise an exception for bad status codes (4xx or 5xx)
        response.raise_for_status()
        
        print("Successfully fetched the data!")
        print("Response Content:")
        print("-----------------")
        # Print the response content as text
        print(response.text)
        
    except requests.exceptions.HTTPError as http_err:
        print(f"HTTP error occurred: {http_err}")
    except requests.exceptions.RequestException as req_err:
        print(f"An error occurred during the request: {req_err}")



BASE_URL = "https://launchpad.classlink.com/login"
LANGUAGE = "en"
NAMESPACE = "translation"
CACHE_BUSTER = 1234567890 
fetch_localization_file(BASE_URL, LANGUAGE, NAMESPACE, CACHE_BUSTER)
