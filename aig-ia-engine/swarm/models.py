from enum import Enum
from typing import Any, List, Optional

from pydantic import BaseModel, Field


class MessageType(str, Enum):
    START_SCAN = "START_SCAN"
    SCAN_RESULT = "SCAN_RESULT"
    DESIGN_SOLUTION = "DESIGN_SOLUTION"
    BUILD_CODE = "BUILD_CODE"
    REVIEW_CODE = "REVIEW_CODE"
    DESIGN_SPEC = "DESIGN_SPEC"
    TASK_COMPLETE = "TASK_COMPLETE"
    ERROR = "ERROR"
    INFO = "INFO"
    BROWSE_REQUEST = "BROWSE_REQUEST"
    BROWSE_RESULT = "BROWSE_RESULT"
    SUB_MISSION_TRIGGER = "SUB_MISSION_TRIGGER"

class ScanIssue(BaseModel):
    category: str  # e.g., SIZE, TODO, AI_CANDIDATE
    path: str
    description: str
    severity: str = "INFO"

class ScanReport(BaseModel):
    total_issues: int
    issues: List[ScanIssue]
    timestamp: str

class DesignSpec(BaseModel):
    issue_id: str
    proposed_solution: str
    affected_files: List[str]
    implementation_plan: str

class BuildResult(BaseModel):
    spec_id: str
    success: bool
    changes: List[str]
    error_message: Optional[str] = None

class SwarmMessageContent(BaseModel):
    data: Any
    metadata: Optional[dict] = Field(default_factory=dict)
