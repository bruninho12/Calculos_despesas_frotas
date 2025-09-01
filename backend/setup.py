from setuptools import setup, find_packages

setup(
    name="frota-api",
    version="1.0.0",
    packages=find_packages(),
    install_requires=[
        "fastapi==0.105.0",
        "uvicorn==0.24.0",
        "pandas==1.5.3",
        "numpy==1.24.3",
        "openpyxl==3.1.2",
        "python-multipart==0.0.6",
        "python-dateutil==2.8.2",
        "requests==2.31.0",
        "python-dotenv==1.0.0",
        "gunicorn==21.2.0",
    ],
)
