"""Comment and feedback endpoints."""

from flask import Blueprint, request, jsonify
from pydantic import ValidationError
from models import CommentRequest, FeedbackRequest
from database import add_comment, get_comments, delete_comment, add_feedback

comments_bp = Blueprint("comments", __name__)


# ──────────────────────────────────────────────
# Comments
# ──────────────────────────────────────────────

@comments_bp.route("/api/comments/<remedy_id>", methods=["GET"])
def list_comments(remedy_id):
    """Get all comments for a remedy.

    Returns: { "comments": [...] }
    """
    try:
        comments = get_comments(remedy_id)
        return jsonify({"comments": comments}), 200
    except Exception as e:
        print(f"[PRANA API] Error fetching comments: {e}")
        return jsonify({"error": "Failed to fetch comments", "comments": []}), 500


@comments_bp.route("/api/comments", methods=["POST"])
def create_comment():
    """Create a new comment on a remedy.

    POST body: { "remedy_id": "...", "author_name": "...", "content": "...", "parent_id": null }
    Returns: { "comment": {...} }
    """
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Request body is required"}), 400

        try:
            validated = CommentRequest(**data)
        except ValidationError as e:
            return jsonify({"error": "Invalid input", "details": e.errors()}), 400

        comment = add_comment(
            remedy_id=validated.remedy_id,
            author_name=validated.author_name,
            content=validated.content,
            parent_id=validated.parent_id,
        )

        return jsonify({"comment": comment}), 201

    except Exception as e:
        print(f"[PRANA API] Error creating comment: {e}")
        return jsonify({"error": "Failed to create comment", "message": str(e)}), 500


@comments_bp.route("/api/comments/<int:comment_id>", methods=["DELETE"])
def remove_comment(comment_id):
    """Delete a comment by its ID.

    Returns: { "status": "deleted" }
    """
    try:
        deleted = delete_comment(comment_id)
        if deleted:
            return jsonify({"status": "deleted"}), 200
        return jsonify({"error": "Comment not found"}), 404
    except Exception as e:
        print(f"[PRANA API] Error deleting comment: {e}")
        return jsonify({"error": "Delete failed", "message": str(e)}), 500


# ──────────────────────────────────────────────
# Feedback
# ──────────────────────────────────────────────

@comments_bp.route("/api/feedback", methods=["POST"])
def submit_feedback():
    """Submit research feedback.

    POST body: { "rating": 1-5, "helpful": "...", "improve": "...", "search_id": null }
    Returns: { "status": "saved", "feedbackId": int }
    """
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Request body is required"}), 400

        try:
            validated = FeedbackRequest(**data)
        except ValidationError as e:
            return jsonify({"error": "Invalid input", "details": e.errors()}), 400

        feedback_id = add_feedback(
            rating=validated.rating,
            helpful=validated.helpful,
            improve=validated.improve,
            search_id=validated.search_id,
        )

        return jsonify({"status": "saved", "feedbackId": feedback_id}), 201

    except Exception as e:
        print(f"[PRANA API] Error saving feedback: {e}")
        return jsonify({"error": "Failed to save feedback", "message": str(e)}), 500
