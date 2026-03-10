from fetch_procedures import ingest_procedure
from link_collector import get_procedure_links


def run():

    urls = get_procedure_links()

    print("Found", len(urls), "procedure pages")

    for url in urls[:10]:   # limit first run

        print("Processing:", url)

        try:
            ingest_procedure(url)

        except Exception as e:
            print("Error:", e)


if __name__ == "__main__":
    run()