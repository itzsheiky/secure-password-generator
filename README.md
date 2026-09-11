# Secure Password Generator

A small, beginner-friendly command-line application that creates strong passwords using Python's cryptographically secure `secrets` module.

## Features

- Choose any positive password length
- Include uppercase letters, lowercase letters, numbers, and/or symbols
- Uses safe defaults: 16 characters with all character types enabled
- Ensures every selected character type appears in the generated password
- Handles invalid lengths, invalid yes/no choices, and incompatible selections clearly
- Uses no external dependencies

## Installation

1. Clone this repository:

   ```bash
   git clone https://github.com/your-username/secure-password-generator.git
   cd secure-password-generator
   ```

2. Make sure Python 3 is installed:

   ```bash
   python --version
   ```

No `requirements.txt` is needed because this project uses only Python's standard library.

## Usage

Run the program from the project folder:

```bash
python main.py
```

Example session:

```text
Password length (default: 16): 20
Include uppercase letters? [Y/n]: y
Include lowercase letters? [Y/n]: y
Include numbers? [Y/n]: y
Include symbols? [Y/n]: y

Your secure password: example-password-output
```

Press Enter at a character-type prompt to accept the default of **yes**. For a quick password, press Enter at every setup prompt.

## Security

This project deliberately uses `secrets`, not `random`. The `secrets` module is designed for security-sensitive values and obtains cryptographically strong randomness from the operating system. Password characters are selected with `secrets.choice`, and their order is shuffled with `secrets.randbelow`.

When several character types are selected, the generator includes at least one character from each type. For real accounts, use a unique password for every service and store it in a trusted password manager.

## Technologies Used

- Python 3
- Python standard library (`secrets` and `string`)

## Project Structure

```text
secure-password-generator/
├── main.py        # CLI application
├── README.md      # Project documentation
└── .gitignore     # Python and editor files to exclude from Git
```

## License

This project is available for learning and portfolio use.
