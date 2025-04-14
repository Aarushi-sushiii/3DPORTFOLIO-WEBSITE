import random

def generate_bodmas_question():
    """Generates a math question with at least 3 operations following BODMAS rules."""
    patterns = [
        lambda: f"{random.randint(1,10)} + {random.randint(1,5)} * {random.randint(1,5)} - {random.randint(1,5)}",
        lambda: f"({random.randint(1,10)} + {random.randint(1,5)}) * {random.randint(1,5)} - {random.randint(1,5)}",
        lambda: f"{random.randint(1,10)} + ({random.randint(1,5)} * {random.randint(1,5)} - {random.randint(1,5)})",
        lambda: f"({random.randint(1,10)} - {random.randint(1,5)}) * {random.randint(1,5)} + {random.randint(1,5)}",
        lambda: f"{random.randint(1,10)} + {random.randint(1,5)} - {random.randint(1,5)} * {random.randint(1,5)}"
    ]
    expr = random.choice(patterns)()
    question = f"What is {expr}?"
    answer = eval(expr)
    return question, answer

def quiz_app(total_questions=100):
    print("🧠 Welcome to the BODMAS Math Quiz App! 🧠")
    print("All questions involve multiple operations and test your BODMAS skills!\n")

    correct_count = 0

    while correct_count < total_questions:
        question, answer = generate_bodmas_question()
        while True:
            try:
                user_input = int(input(f"Q{correct_count+1}: {question} "))
                if user_input == answer:
                    print("✅ You are good to go!\n")
                    correct_count += 1
                    break
                else:
                    print("❌ Incorrect answer. Try again!\n")
            except ValueError:
                print("⚠️ Please enter a valid number.\n")

    print("🎉 Congratulations! You completed all 100 BODMAS-style questions.")

# Run it!
quiz_app()
