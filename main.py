"""Interactive, cryptographically secure password generator."""

import secrets
import string


CHARACTER_SETS = {
    "uppercase letters": string.ascii_uppercase,
    "lowercase letters": string.ascii_lowercase,
    "numbers": string.digits,
    "symbols": "!@#$%^&*()-_=+[]{};:,.?",
}


def ask_for_length() -> int:
    """Prompt until the user supplies a positive password length."""
    while True:
        raw_length = input("Password length (default: 16): ").strip()
        if not raw_length:
            return 16

        try:
            length = int(raw_length)
        except ValueError:
            print("Please enter a whole number, such as 16.")
            continue

        if length < 1:
            print("Password length must be at least 1.")
            continue

        return length


def ask_yes_no(label: str) -> bool:
    """Return a validated yes/no answer; Enter keeps the safe default (yes)."""
    while True:
        answer = input(f"Include {label}? [Y/n]: ").strip().lower()
        if answer in ("", "y", "yes"):
            return True
        if answer in ("n", "no"):
            return False
        print("Please answer y or n.")


def choose_character_sets() -> list[str]:
    """Collect the character sets requested by the user."""
    selected_sets = []
    for label, characters in CHARACTER_SETS.items():
        if ask_yes_no(label):
            selected_sets.append(characters)
    return selected_sets


def secure_shuffle(characters: list[str]) -> None:
    """Shuffle in place with secrets rather than the non-cryptographic random module."""
    for index in range(len(characters) - 1, 0, -1):
        swap_index = secrets.randbelow(index + 1)
        characters[index], characters[swap_index] = characters[swap_index], characters[index]


def generate_password(length: int, selected_sets: list[str]) -> str:
    """Generate a password containing at least one character from every chosen set."""
    if not selected_sets:
        raise ValueError("Choose at least one character type.")
    if length < len(selected_sets):
        raise ValueError(
            f"Length must be at least {len(selected_sets)} when using {len(selected_sets)} character types."
        )

    # Seed with one character per selected type, then fill from their combined pool.
    password_characters = [secrets.choice(character_set) for character_set in selected_sets]
    combined_pool = "".join(selected_sets)
    password_characters.extend(
        secrets.choice(combined_pool) for _ in range(length - len(password_characters))
    )
    secure_shuffle(password_characters)
    return "".join(password_characters)


def main() -> None:
    print("\n" + "=" * 48)
    print("         SECURE PASSWORD GENERATOR")
    print("=" * 48)
    print("Press Enter at a choice prompt to include that type.\n")

    while True:
        length = ask_for_length()
        selected_sets = choose_character_sets()

        try:
            password = generate_password(length, selected_sets)
        except ValueError as error:
            print(f"\nUnable to generate password: {error}\n")
            continue

        print("\n" + "-" * 48)
        print(f"Your secure password: {password}")
        print("-" * 48)

        again = input("Generate another password? [y/N]: ").strip().lower()
        if again not in ("y", "yes"):
            print("\nStay secure. Goodbye!")
            break
        print()


if __name__ == "__main__":
    main()
