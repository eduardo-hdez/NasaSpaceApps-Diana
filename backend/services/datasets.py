import csv

def get_dataset_objects():
    datasets = [
        {
            "title": "Kepler Objects of Interest",
            "description": """
                KOIs are well vetted, periodic, transit-like 
                events in the Kepler data. The Kepler Project 
                identifies these objects from the TCE list for 
                further vetting. Some objects will be flagged 
                as false positives..
            """,
            "img": "kepler_img.jpeg"
        },
        {
            "title": "K2 Planets y Candidates",
            "description": """
                This dataset is a comprehensive list of all confirmed 
                exoplanets, planetary candidates, and false positives 
                determined on all the transits captured by the K2 
                mission. See the “Archive Disposition” column for 
                classification.
            """,
            "img": "k2_img.jpg"
        },
        {
            "title": "TESS Objects of Interest (TOI)",
            "description": """
                This dataset is a comprehensive list of all confirmed 
                exoplanets, planetary candidates (PC), false positives 
                (FP), ambiguous planetary candidates (APC), and known 
                planets (KP, previously identified) identified by the 
                TESS mission so far.
            """,
            "img": "tess_img.jpg"
        },
    ]

    return datasets

def select_clean_dataset(datasetId):
    csv_file = f"resources/clean/{datasetId}_clean.csv"
    if (csv_file):
        with open(csv_file, 'r') as file:
            reader = csv.DictReader(file)
            data = list(reader)
            result = {
                "status": 200,
                "data": data
            }
            return result
    return { "status": 400, "data": "" }
    
