import re


def normalize_brand(brand) -> str:
    """Return a consistent brand name, e.g. ' BMW' -> 'Bmw', 'mercedes-benz' -> 'Mercedes-Benz'."""
    text = str(brand).strip()
    # Remove punctuation such as commas or colons, but keep letters, digits, spaces and hyphens
    text = re.sub(r"[^\w\s-]", "", text)
    return text.title() if text else "Other"


def brand_from_title(title) -> str:
    """The brand is the first word of the announcement title."""
    words = str(title).split()
    return normalize_brand(words[0]) if words else "Other"