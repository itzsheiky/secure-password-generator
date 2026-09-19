# Secure Password Generator

A small, beginner-friendly password generator with both a Python command-line interface and a polished static browser interface.

## Features

- Choose any positive password length
- Include uppercase letters, lowercase letters, numbers, and/or symbols
- Uses safe defaults: 16 characters with all character types enabled
- Ensures every selected character type appears in the generated password
- Handles invalid lengths, invalid yes/no choices, and incompatible selections clearly
- Uses no external dependencies
- Includes a responsive VoidPass web interface with strength and entropy guidance

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

CLI example session:

```text
Password length (default: 16): 20
Include uppercase letters? [Y/n]: y
Include lowercase letters? [Y/n]: y
Include numbers? [Y/n]: y
Include symbols? [Y/n]: y

Your secure password: example-password-output
```

Press Enter at a character-type prompt to accept the default of **yes**. For a quick password, press Enter at every setup prompt.

## Frontend

The dependency-free VoidPass web interface generates passwords in the browser with `crypto.getRandomValues()`. It keeps generated values out of storage and network requests, and provides a 4–128 character length range, character-set controls, copy and regeneration actions, strength guidance, and responsive accessibility controls.

Run the frontend locally from the project folder:

```bash
python -m http.server 8000
```

Then open <http://localhost:8000> in a browser. The approximate entropy display is guidance based on password length and the enabled character pool; it is not a guarantee of real-world password security.

### Screenshots

Add a screenshot of the VoidPass interface here when publishing the project.

## Security

This project deliberately uses `secrets`, not `random`. The `secrets` module is designed for security-sensitive values and obtains cryptographically strong randomness from the operating system. Password characters are selected with `secrets.choice`, and their order is shuffled with `secrets.randbelow`.

When several character types are selected, the generator includes at least one character from each type. For real accounts, use a unique password for every service and store it in a trusted password manager.

The browser version uses rejection sampling with `crypto.getRandomValues()` to avoid modulo bias, guarantees one character from every enabled category, and securely shuffles the result. It does not log, store, or transmit generated passwords.

## Technologies Used

- Python 3
- Python standard library (`secrets` and `string`)
- HTML5, CSS, and vanilla JavaScript

## Project Structure

```text
secure-password-generator/
├── main.py        # Python CLI application
├── index.html     # Browser interface
├── styles.css     # Responsive Void theme
├── app.js         # Local browser generator
├── README.md      # Project documentation
└── .gitignore     # Ignored Python and editor files
```

## License

This project is available for learning and portfolio use.
